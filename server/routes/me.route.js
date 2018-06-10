import express from 'express';

import Me from '../controllers/me.handler';

const router = express.Router();


router.route('/')
  .get(Me.get);

export default router;
