import { HttpStatus, Messages } from '@constants';
import { ErrorRes } from '@helpers';
import { IUser, User } from '@models';

const create = async (data: Partial<IUser>) => {
  data.email = data?.email?.toLowerCase();

  const userExists: IUser = await User.findByEmail(data.email);

  if (userExists?.isEmailVerified) {
    throw new ErrorRes(HttpStatus.badRequest, Messages.emailExists);
  } else if (userExists && !userExists.isEmailVerified) {
    await User.findByIdAndDelete(userExists.id);
  }

  const user = (await User.create(data)).toObject();
  delete user.password;
  return user;
};

const fetchDetails = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export { create, fetchDetails };
