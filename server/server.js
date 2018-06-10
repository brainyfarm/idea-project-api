import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import MeRoutes from './routes/me.route';
import IdeaRoutes from './routes/idea.route';
import UserRoutes from './routes/user.route';
import AccessTokenRoutes from './routes/token.route';

dotenv.config();

const app = express();
const log = console.info;
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI, () => {
  log('Database Connection established');
});

app.use(cors());
app.use(morgan('combined', { immediate: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/me', MeRoutes);
app.use('/ideas', IdeaRoutes);
app.use('/users', UserRoutes);
app.use('/access-tokens', AccessTokenRoutes);


app.listen(PORT, () => {
  log(`Listening on ${PORT}`);
});
