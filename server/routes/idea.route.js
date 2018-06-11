import express from 'express';

import Idea from '../controllers/idea.handler';

const router = express.Router();

router.route('/')
  .post(Idea.create)
  .get(Idea.list);

router.route('/:id')
  .put(Idea.update)
  .delete(Idea.delete);

export default router;
