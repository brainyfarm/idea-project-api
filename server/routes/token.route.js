import express from 'express';

import User from '../controllers/user.handler';
import isAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();


router.route('/')
  .post(User.login)
  .delete(isAuthenticated, User.logout);

router.route('/refresh')
  .post(User.refreshToken);

export default router;
