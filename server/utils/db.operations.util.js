import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import TokenService from '../utils/token.util';

export const createItem = (model, data) => {
  const newEntryData = new model(data);
   return new Promise((resolve, reject) => {
      return newEntryData.save()
        .then((instance) => resolve(instance))
        .catch((error) => reject(error));
  });
};

export const createUser = (userModel, tokenModel, userData) => {
  const newUserData = new userModel(userData);
  return new Promise((resolve, reject) => {
    return createItem(userModel, newUserData)
      .then((user) => {
        const jwt = TokenService.sign(user);
        const refresh_token = randomBytes(100).toString('hex');
        const refreshTokenData = { token: refresh_token, user_id: user.id };
        return createItem(tokenModel, refreshTokenData)
          .then(() => resolve({ jwt, refresh_token }));
      })
      .catch(error => reject(error));
  });
};

export const findOneItem = (model, conditions) => {
  return new Promise((resolve, reject) => {
    return model.findOne(conditions).exec()
      .then(item => resolve(item))
      .catch(error => reject(error));
  });
};

export const loginUser = (userModel, tokenModel, userData) => {
  const { email } = userData;
  return new Promise((resolve, reject) => {
    return findOneItem(userModel, { email })
    .then((user) => {
      return bcrypt.compare(userData.password, user.password)
      .then(isGoodPassword => {
        const jwt = TokenService.sign(user);
        const refresh_token = randomBytes(100).toString('hex');
        const refreshTokenData = { token: refresh_token, user_id: user.id };
        return isGoodPassword ? createItem(tokenModel, refreshTokenData)
          .then(() => resolve({ jwt, refresh_token })) : reject(false);
        });
      })
      .catch(error => reject(error));
  });
};

export const refreshUserToken = (User, Token, refreshToken) =>
  new Promise((resolve, reject) =>
  findOneItem(Token, { token: refreshToken })
    .then(token => 
      token && !token.blacklisted ?
        findOneItem(User, { _id: token.user_id })
          .then(user => {
            const jwt = TokenService.sign(user);
            return resolve({ jwt });
        }) : resolve(false))
    .catch(error => reject(error))
  );


export const findItemAndUpdate = (model, conditions, updateValues, options) =>
  new Promise((resolve, reject) => 
    model.findOneAndUpdate(conditions, updateValues, options).exec()
      .then(item => resolve(item))
      .catch(error => reject(error)));

export const findOneAndRemove = (model, id, user_id) =>
  new Promise((resolve, reject) => {
    return model.findOneAndRemove({ id, user_id }).exec()
      .then(() => resolve(true))
      .catch(error => reject(error));
  });

export const findItems = (model, condtions, excludes) =>
  new Promise((resolve, reject) => {
    return model.find(condtions)
      .select(excludes).exec()
        .then(result => resolve(result))
        .catch(error => reject(error));
  });
