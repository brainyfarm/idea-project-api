import express from 'express';

import Idea from '../controllers/idea.handler';

const router = express.Router();

router.route('/')
  .post(Idea.create)
  .get(Idea.list)
  .patch(Idea.update)
  .delete(Idea.delete);

export default router;
