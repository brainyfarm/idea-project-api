import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../models/user.model';

import isCompliantPassword from '../utils/password.util';

class UserController {
  static create(request, response) {
    const { name, email, password } = request.body;
    const newUser = new User({ name, email, password });
    return isCompliantPassword(password) ?
      newUser.save()
        .then((user) => {
          // console.log(user);

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
                  return response.status(200)
                    .json({
                      success: true,
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
              error: 'Error reading from the database',
            });
        })
      : response.status(400)
        .json({
          success: false,
          error: 'Provide an email address and password',
        });
  }

  static logout(request, response) {
    // const 
  }
}

export default UserController;
