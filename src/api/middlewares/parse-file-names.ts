import { ExpressHandler } from 'types/express';

const parseFileNames: ExpressHandler = async (req, res, next) => {
  for (let key in req.files) {
    if (req.files[key].length) {
      req.body[key] = (req.files as any)?.[key]?.map((file) => file.filename);
    } else {
      req.body[key] = (req.files as any)?.[key][0].filename;
    }
  }
  next();
};
export { parseFileNames };
