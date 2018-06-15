import sqlite from 'sqlite3';

import Token from '../utils/token.util';
import * as Reply from '../utils/responses.util';
import SQliteManager from '../sqlite3/sqlite3.manager';


const sqlite3 = sqlite.verbose();
const SQLITE_DB = process.env.SQLITE_DB;

const BAD_TOKENS_DB = new sqlite3.Database(SQLITE_DB, (err) => {
  if(err) throw err;
});

const tokenIsValid = (token) => {
  const currentTime = new Date().getTime() / 1000;
  const tokenPayload = Token.decode(token);
  if(currentTime > tokenPayload.exp)
  return false;
  return true;
};

const isAuthenticated = (request, response, next) => {
  const jwt = request.headers['x-access-token'] || '';
  if(!tokenIsValid(jwt))
    return Reply.authError(response, 'invalid token');
  return SQliteManager.findToken(BAD_TOKENS_DB, jwt)
    .then((badtoken) => {
      return badtoken ?
        Reply.authError(response, 'invalid token') :
        next();
    })
      .catch(error => Reply.serverError(response, error));
};

export default isAuthenticated;
