import Token from '../utils/token.util';
import User from '../models/user.model';

class MeController {
  static get(request, response) {
    const token = request.headers['x-access-token'];
    const currentUserId = Token.decode(token).id;
    console.log(currentUserId);
    return User.findById(currentUserId, 'email name').exec()
      .then((user) => {
        if(!user) {
          return response.status(404)
            .json({ error: 'User does not exist' });
        }
        return response.status(200)
          .json(user);
      })
      .catch((error) => {
        return response.status(500)
          .json({ error });
      });
  }
}

export default MeController;
