import { ExpressHandler } from 'types/express';
import { HttpStatus, Messages } from '@constants';
import { UserService } from '@services';
import { ErrorRes, successRes } from '@helpers';

const updateUser: ExpressHandler = async (req, res) => {
  const payload = { ...req.body };

  const user = await UserService.updateUserById(req.user.id, payload);

  return successRes(res, HttpStatus.ok, Messages.update('User'), user);
};
const getUserDetails: ExpressHandler = async (req, res) => {
  const userId = req?.query?.userId || req.user.id;

  const userDetails = await UserService.fetchDetails(userId);

  return successRes(res, HttpStatus.ok, Messages.details('User'), userDetails);
};

const changePassword: ExpressHandler = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = req.user;

  const isPasswordCorrect = await user.checkPass(oldPassword);

  if (!isPasswordCorrect) throw new ErrorRes(HttpStatus.badRequest, 'Old Password is incorrect');

  user.password = newPassword;
  await user.save();

  return successRes(res, HttpStatus.ok, Messages.update('Password'));
};

const deleteUser: ExpressHandler = async (req, res) => {
  await UserService.deleteUser.soft(req.user.id);
  return successRes(res, HttpStatus.ok, Messages.delete('User account'));
};

const deactivateUser: ExpressHandler = async (req, res) => {
  await UserService.deactivateUser(req.user.id);
  return successRes(res, HttpStatus.ok, 'User deactivated successfully');
};

export { getUserDetails, updateUser, changePassword, deleteUser, deactivateUser };
