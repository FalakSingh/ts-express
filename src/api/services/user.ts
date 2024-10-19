import { IUser, User } from '@models';

const checkIfEmailIsVerified = async (email: string) => await User.emailExists(email);

const findUserByEmail = async (email: string): Promise<IUser> => await User.findByEmail(email);

const deleteUser = {
  hard: async (userId: string) => await User.findByIdAndDelete(userId),
  soft: async (userId: string) => await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true }),
};

const create = async (data: Partial<IUser>) => {
  const user = (await User.create(data)).toObject();
  delete user.password;
  return user;
};

const fetchDetails = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

export { checkIfEmailIsVerified, findUserByEmail, create, fetchDetails, deleteUser };
