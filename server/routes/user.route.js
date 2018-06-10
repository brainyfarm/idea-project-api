import express from 'express';

import User from '../controllers/user.handler';

const router = express.Router();


router.route('/')
  .post(User.create);

export default router;
