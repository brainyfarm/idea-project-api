import bcrypt from 'bcrypt';
import sqlite from 'sqlite3';
import { randomBytes } from 'crypto';

import User from '../models/user.model';
import Token from '../models/token.model';

import SQliteManager from '../sqlite3/sqlite3.manager';


import verifyUserInputs from '../utils/validate.util';
import * as Reply from '../utils/responses.util';
import { getGravatarUrl } from '../utils/gravatar.util';
import * as db from '../utils/db.operations.util';


const sqlite3 = sqlite.verbose();
const SQLITE_DB = process.env.SQLITE_DB;

const BAD_TOKENS_DB = new sqlite3.Database(SQLITE_DB, (err) => {
  if(err) throw err;
});

class UserController {
  static create(request, response) {
    const { name, email, password } = request.body;
    const avatar_url = getGravatarUrl(email);
    const userData = { email, name, password, avatar_url };
    return verifyUserInputs('createUser', userData)
    .then(() => db.createUser(User, Token, userData)
       .then(data => Reply.responseCreateOk(response, data))
       .catch(err => Reply.serverError(response, err))
    )
    .catch(error => Reply.badRequest(response, error));
  }

  static login(request, response) {
    return verifyUserInputs('loginUser', request.body)
      .then(() => 
        db.loginUser(User, Token, request.body)
          .then(tokens => Reply.responseOk(response, tokens))
          .catch(error => Reply.authError(response, error)))
      .catch(error => Reply.badRequest(response, error));
  }

  static refreshToken(request, response) {
    console.log(db.refreshUserToken);
    return verifyUserInputs('refreshToken', request.body)
      .then(() => {
        return db.refreshUserToken(User, Token, request.body.refresh_token)
          .then(newToken => 
            newToken ?
              Reply.responseOk(response, newToken) :
              Reply.authError(response, 'invalid refresh token'))
          .catch(error => Reply.serverError(response, error));
      })  
      .catch(error => Reply.badRequest(response, error));
  }

  static logout(request, response) {
    const jwt = request.headers['x-access-token'];
    return SQliteManager.addToken(BAD_TOKENS_DB, jwt)
      .then(() => Reply.deleteSuccess(response))
      .catch(error => Reply.serverError(response, error));
  }
}

export default UserController;
