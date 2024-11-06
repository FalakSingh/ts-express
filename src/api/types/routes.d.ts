import { ExpressHandler } from './express';

type TRoute = {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: ExpressHandler;
  middleware?: Array<any>;
};
