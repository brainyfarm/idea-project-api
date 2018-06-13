import Idea from '../models/idea.model';
import Token from '../utils/token.util';
import Paginator from '../utils/paginate.util';

class IdeaController {
  static create(request, response) {
    const token = request.headers['x-access-token'];
    const { content, impact, ease, confidence } = request.body;
    const { id } = Token.decode(token);
    console.log(id);
    const newIdea = new Idea({ content, impact, ease, confidence, user_id: id });

    return newIdea.save()
      .then(idea => 
        response.status(201)
          .json( idea ))
      .catch(error => 
        response.status(500)
          .json({ error})
        );
  }

  static update(request, response) {
    const token = request.headers['x-access-token'];
    const ideaId = request.params.id;
    const currentUserId = Token.decode(token).id;
    const updateFields = request.body;
    
    /** In case a malicious user is trying to be smart */
    delete updateFields.user_id;
    delete updateFields._id;

    return Idea.findOneAndUpdate(
        { _id: ideaId, user_id: currentUserId }, { $set: updateFields }, 
        { new: true, runValidators: true },).exec()
          .then(idea => 
            response.status(200)
              .json( idea ))
          .catch(error => 
            response.status(500)
              .json({ error })
          );
  }

  static delete(request, response) {
    const token = request.headers['x-access-token'];
    const ideaId = request.params.id;
    const currentUserId = Token.decode(token).id;
    console.log(currentUserId);
    return Idea.findOneAndRemove({ _id: ideaId, user_id: currentUserId})
      .then(() => 
        response.status(204)
          .json({ }))
      .catch(error => 
        response.status(500)
          .json({ error }));
  }

  static list(request, response) {
    const currentPage = Number(request.query.page) || 1;
    const limit = 10;
    const token = request.headers['x-access-token'];
    const currentUserId = Token.decode(token).id;

    return Idea.find(
        { user_id: currentUserId },)
        .sort({ created_at: -1 }).exec()
          .then(ideas => {
            console.log(ideas.length);
            return response.status(200)
            .json(Paginator(ideas, currentPage, limit)); 
          })
          .catch(error =>
            response.status(500)
              .json({ error })
          );
  }
}

export default IdeaController;
