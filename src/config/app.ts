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

// enable cors
app.use(cors({ origin: '*' }));

// enable http security headers
app.use(helmet());

// parse json body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//serve a static folder on server
app.use(express.static(path.join(__dirname, '../../public')));

// gzip compression
app.use(compression());

// sanitize request data
app.use(ExpressMongoSanitize());

// http request logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms [:remote-addr]'));

//allRoutes
app.use(indexRouter);

//Handles ErrorRes errors
app.use(ErrorHandler);

export default app;
