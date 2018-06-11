import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import User from '../models/user.model';
import RefreshToken from '../models/token.model';

import isCompliantPassword from '../utils/password.util';
import Token from '../utils/token.util';

class UserController {
  static create(request, response) {
    const { name, email, password } = request.body;
    const newUser = new User({ name, email, password });
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
    .populate('email')
    .exec()
      .then((refresh) => {
        console.log(refresh);
        if(!refresh || refresh.blacklisted) {
          return response.status(401)
            .json({
              error: 'invalid refresh token',
            });
        }
      });
  }

  static logout(request, response) {
    // const 
  }
}

export default UserController;
