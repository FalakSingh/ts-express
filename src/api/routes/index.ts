import { Router } from 'express';
const indexRouter = Router();
import Env from '@env';
import { HttpStatus, Messages } from '@constants';
import { ErrorRes } from '@helpers';
import { authRouter } from './auth';

const routes = [{ path: 'auth', router: authRouter }];

routes.forEach(({ path, router }) => indexRouter.use(`/api/${path}`, router));

indexRouter.route('/').get((req, res) => {
  const uptime = process.uptime();
  res.send(`Server is up and running in ${Env.NODE_ENV} environment <br/>
    Server Time: ${new Date()} <br />
    UpTime in seconds:${Math.floor(uptime)} <br />
    UpTime in minutes:${Math.floor(uptime / 60)} <br />
    UpTime in hours:${Math.floor(uptime / 3600)} <br />
    `);
});

indexRouter.use(async (req, res, next) => {
  next(new ErrorRes(HttpStatus.notFound, Messages.notFound));
});

export default indexRouter;
