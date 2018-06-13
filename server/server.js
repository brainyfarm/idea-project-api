import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import sqlite from 'sqlite3';

import MeRoutes from './routes/me.route';
import IdeaRoutes from './routes/idea.route';
import UserRoutes from './routes/user.route';
import AccessTokenRoutes from './routes/token.route';
import SqliteManager from './sqlite3/sqlite3.manager';
import SQliteDBFileCreator from './utils/createdb.util';

dotenv.config();

const app = express();
const { log, error } = console;
const sqlite3 = sqlite.verbose();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;
const SQLITE_DB = process.env.SQLITE_DB;

SQliteDBFileCreator(SQLITE_DB);

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI, () => {
  log('Database Connection established');
});

const tokenDb = new sqlite3.Database(SQLITE_DB, (err) => {
  if(err) 
    return error(err);
  SqliteManager.createTokenTable(tokenDb);
}); 

app.use(cors());
app.use(morgan('combined', { immediate: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/me', MeRoutes);
app.use('/ideas', IdeaRoutes);
app.use('/users', UserRoutes);
app.use('/access-tokens', AccessTokenRoutes);

app.listen(PORT, () => 
  log(`Listening on ${PORT}`)
);
