import express from 'express';

import Me from '../controllers/me.handler';
import isAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();


router.route('/')
  .get(isAuthenticated, Me.get);

export default router;
