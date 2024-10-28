import { IUser, User } from '@models';
import { Device } from '../models/user';
const checkIfEmailIsVerified = async (email: string) => await User.emailExists(email);

const findUserByEmail = async (email: string) => await User.findByEmail(email);
const findUserById = async (id: string) => await User.findById(id);
const setUserEmailVerified = async (email: string) => await User.findOneAndUpdate({ email }, { isEmailVerified: true });

// const checkIfEmail

const deleteUser = {
  hard: async (userId: string) => await User.findByIdAndDelete(userId),
  soft: async (userId: string) => await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true }),
};

const createUser = async (data: Partial<IUser>) => {
  let user = (await User.create(data)).toObject();
  delete user.password;
  return user;
};

const fetchDetails = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

const updateUserById = async (id: string, payload: Record<string, any>) =>
  await User.findByIdAndUpdate(id, { ...payload }, { new: true });

const addUserDevice = (user: IUser, deviceInfo: Omit<Device, 'loginTimeStamp'>) => {
  const existingDeviceIndex = user.devices.findIndex((device) => device.deviceId === deviceInfo.deviceId);

  if (existingDeviceIndex !== -1) {
    user.devices[existingDeviceIndex].deviceToken = deviceInfo.deviceToken;
    user.devices[existingDeviceIndex].loginTimeStamp = new Date();
  } else {
    user.devices.push({ ...deviceInfo, loginTimeStamp: new Date() });
  }

  return user;
};

const removeUserDevice = async (user: IUser, deviceId: string) => {
  user.devices = user.devices.filter((device) => device.deviceId !== deviceId);
};

export {
  checkIfEmailIsVerified,
  setUserEmailVerified,
  findUserByEmail,
  findUserById,
  createUser,
  fetchDetails,
  deleteUser,
  updateUserById,
  addUserDevice,
  removeUserDevice,
};
