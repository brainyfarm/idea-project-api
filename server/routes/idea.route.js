import express from 'express';

import Idea from '../controllers/idea.handler';
import isAuthenticated from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .post(isAuthenticated, Idea.create)
  .get(isAuthenticated, Idea.list);

router.route('/:id')
  .put(isAuthenticated, Idea.update)
  .delete(isAuthenticated, Idea.delete);

export default router;
