import express from 'express';

import User from '../controllers/user.handler';

const router = express.Router();


router.route('/')
  .post(User.login)
  .delete(User.logout);

router.route('/refresh')
  .post(User.refreshToken);

export default router;
