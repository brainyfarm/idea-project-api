import sqlite from 'sqlite3';

import Token from '../utils/token.util';
import SQliteManager from '../sqlite3/sqlite3.manager';


const sqlite3 = sqlite.verbose();
const SQLITE_DB = process.env.SQLITE_DB;

const BAD_TOKENS_DB = new sqlite3.Database(SQLITE_DB, (err) => {
  if(err) throw err;
});

const tokenIsValid = (token) => {
  const currentTime = new Date().getTime() / 1000;
  const tokenPayload = Token.decode(token);
  if(currentTime > tokenPayload)
    return false;
  return true;
};

const isAuthenticated = (request, response, next) => {
  const jwt = request.headers['x-access-token'] || '';
  if(!tokenIsValid(jwt))
    return response.status(401)
      .json({
        error: 'Invalid auth token',
      });
  return SQliteManager.findToken(BAD_TOKENS_DB, jwt)
      .then((badtoken) => {
        if(badtoken)
          return response.status(401)
            .json({
              error: 'Invalid auth token',
            });
        return next();
      })
      .catch((err) => {
        return response.status(500)
          .json({
            error: err.message,
          });
      });
};

export default isAuthenticated;
