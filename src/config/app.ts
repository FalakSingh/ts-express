import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import indexRouter from '@routes';
import { ErrorHandler } from '@middlewares';

// init app
const app: Express = express();

const middlewares = [
  cors({ origin: '*' }),
  helmet(),
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, '../../public')),
  compression(),
  ExpressMongoSanitize(),
  morgan(':method :url :status :res[content-length] - :response-time ms [:remote-addr]'),
  indexRouter,
  ErrorHandler,
];

middlewares.forEach((middleware) => app.use(middleware));

export default app;
