import md5 from 'md5';
import bcrypt from 'bcrypt';
import sqlite from 'sqlite3';
import { randomBytes } from 'crypto';

import User from '../models/user.model';
import RefreshToken from '../models/token.model';

import SQliteManager from '../sqlite3/sqlite3.manager';

import isCompliantPassword from '../utils/password.util';
import Token from '../utils/token.util';

const sqlite3 = sqlite.verbose();
const SQLITE_DB = process.env.SQLITE_DB;

const BAD_TOKENS_DB = new sqlite3.Database(SQLITE_DB, (err) => {
  if(err) throw err;
});

class UserController {
  static create(request, response) {
    const { name, email, password } = request.body;
    const emailHash = md5(email.toLowerCase().trim());
    const avatar_url = `https://www.gravatar.com/avatar/${emailHash}?d=mm&s=200`;
    const newUser = new User({ name, email, password, avatar_url });
    return isCompliantPassword(password) ?
      newUser.save()
        .then((user) => {
          const { _id, name, email } = user;
          const usertokenData = {
            id: _id,
            name,
            email,
          };
          const jwt = Token.sign(usertokenData);
          const newRefreshToken = new RefreshToken({ 
            token: randomBytes(100).toString('hex'),
            user_id: _id,
          });
          return newRefreshToken.save()
            .then((refresh) => {
              return response.status(201)
                .json({
                  jwt,
                  refresh_token: refresh.token,
                });
            })
            .catch((error) => {
              return response.status(500)
                .json({
                  success: false,
                  error,
                });
            });
        })
        .catch(error => response.status(400).json({
          success: false,
          error,
        }))
      :
        response.status(400)
          .json({
            success: false,
            error: 'Password not compliant with policy',
          });
  }

  static login(request, response) {
    let { email, password } = request.body;
    return email && password ?
      User.findOne({ email: email.trim() }).exec()
        .then((user) => {
          if(user) {
            return bcrypt.compare(password, user.password)
              .then((passwordIsCorrect) => {
                if(passwordIsCorrect) {
                  const { _id, name, email } = user;
                  const usertokenData = {
                    id: _id,
                    name,
                    email,
                  };
                  const jwt = Token.sign(usertokenData);
                  const newRefreshToken = new RefreshToken({ 
                    token: randomBytes(100).toString('hex'),
                    user_id: _id,
                  });
                  return newRefreshToken.save()
                  .then((refresh) => {
                    return response.status(200)
                      .json({
                        jwt,
                        refresh_token: refresh.token,
                      });
                  });
                }
                return response.status(401)
                  .json({
                    success: false,
                    error: 'invalid password',
                  });
              });
          }
          return response.status(404)
            .json({
              success: false,
              error: 'no such user',
            });
        })
        .catch((error) => {
          return response.status(500)
            .json({
              success: false,
              error,
            });
        })
      : response.status(400)
        .json({
          success: false,
          error: 'Provide an email address and password',
        });
  }

  static refreshToken(request, response) {
    const { refresh_token } = request.body;
    return RefreshToken.findOne({ token: refresh_token })
    .exec()
      .then((refresh) => {
        if(!refresh || refresh.blacklisted) {
          return response.status(401)
            .json({
              error: 'invalid refresh token',
            });
        }
        return User.findById(refresh.user_id).exec()
          .then((user) => {
            if(user) {
              const { _id, name, email } = user;
              const usertokenData = {
                id: _id,
                name,
                email,
              };
              const jwt = Token.sign(usertokenData);
              return response.status(200)
                .json({ jwt });
            }
          })
          .catch((error) => {
            return response.status(500)
              .json({ error });
          });
      });
  }

  static logout(request, response) {
    const jwt = request.headers['x-access-token'];
    const refresh_token = request.body.refresh_token;
    return SQliteManager.addToken(BAD_TOKENS_DB, jwt)
      .then(() => {
        return response.status(204)
          .json({});
      })
      .catch((err) => {
        return response.status(500)
          .json({
            error: err,
          });
      });
  }
}

export default UserController;
