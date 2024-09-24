import { HttpStatus, Messages } from "../constants/api.constants";
import { ErrorRes } from "../helpers/api-response";
import { IUser, User } from "../models/user";

const create = async (data: Partial<IUser>) => {
  data.email = data?.email?.toLowerCase();
  if (await User.emailExists(data.email))
    throw new ErrorRes(HttpStatus.badRequest, Messages.emailExists);

  const user = (await User.create(data)).toObject();
  delete user.password;
  return user;
};

const fetchDetails = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export { create, fetchDetails };
