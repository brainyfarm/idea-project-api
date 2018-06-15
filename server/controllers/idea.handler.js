import Idea from '../models/idea.model';

import Token from '../utils/token.util';
import Paginator from '../utils/paginate.util';
import * as Reply from '../utils/responses.util';
import * as db from '../utils/db.operations.util';
import verifyUserInputs from '../utils/validate.util';

class IdeaController {
  static create(request, response) {
    const token = request.headers['x-access-token'];
    const user_id = Token.decode(token).id;
    const IdeaData = { ...request.body, user_id };
    return verifyUserInputs('createIdea', request.body)
      .then(() => db.createItem(Idea, IdeaData)
         .then(data => {
            const { id, content, impact, ease, confidence, created_at, average_score } = data; 
            const responseData = { id, content, impact, ease, confidence, average_score, created_at };
            return Reply.responseCreateOk(response, responseData);
          })
         .catch(err => Reply.serverError(response, err)))
      .catch(error => Reply.badRequest(response, error));
  }

  static update(request, response) {
    const token = request.headers['x-access-token'];
    const id = request.params.id;
    const user_id = Token.decode(token).id;

    const condition = { id, user_id };
    const updateFields = { ...request.body };
    const excludes = { _id: 0, __v: 0, user_id: 0};
    const options = { fields: { ...excludes }, new: true, runValidators: true };

    return db.findItemAndUpdate(Idea, condition, updateFields, options)
      .then(idea => idea ?
        Reply.responseOk(response, idea) : 
          Reply.notFoundError(response, 'idea not found'))
      .catch(error => Reply.serverError(response, error));
  }

  static delete(request, response) {
    const token = request.headers['x-access-token'];
    const id = request.params.id;
    const user_id = Token.decode(token).id;
    return db.findOneAndRemove(Idea, id, user_id)
      .then(() => Reply.deleteSuccess(response))
      .catch(error => Reply.serverError(response, error));
  }

  static list(request, response) {
    const currentPage = Number(request.query.page) || 1;
    const limit = 10;
    const token = request.headers['x-access-token'];
    const user_id = Token.decode(token).id;
    const excludes = '-_id -__v -user_id';
    return db.findItems(Idea, { user_id }, excludes)
      .then(ideas => Reply.responseOk(response, Paginator(ideas, currentPage, limit)))
      .catch(error => Reply.serverError(response, error));
  }
}

export default IdeaController;
