import User from '../models/user.model';

import Token from '../utils/token.util';
import * as Reply from '../utils/responses.util';
import { USER_INFO_FIELDS } from '../utils/db.fields.util';

class MeController {
  static get(request, response) {
    const token = request.headers['x-access-token'];
    const _id = Token.decode(token).id;
    return User.findOne({ _id }).select(USER_INFO_FIELDS).exec()
      .then(user => user ?
        Reply.responseOk(response, user) :
        Reply.notFoundError(response, 'user not found'))
      .catch(error => 
        Reply.serverError(response, error.message));
  }
}

export default MeController;
