import { IUser, User } from '@models';
import { Device } from '../models/user';
import { IdType } from 'types/express';
const checkIfEmailIsVerified = async (email: string) => await User.emailExists(email);

const findUser = {
  byId: async (id: string) => await User.findById(id).select('+password'),
  byEmail: async (email: string) => await User.findByEmail(email),
};
const setUserEmailVerified = async (email: string) => await User.findOneAndUpdate({ email }, { isEmailVerified: true });

const deleteUser = {
  hard: async (userId: IdType) => await User.findByIdAndDelete(userId),
  soft: async (userId: IdType) => await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true }),
};

const deactivateUser = async (userId: IdType) =>
  await User.findByIdAndUpdate(userId, { isDeactivated: true }, { new: true });

const createUser = async (data: Partial<IUser>) => await User.create(data);

const fetchDetails = async (id: IdType) => {
  const user = await User.findById(id);
  return user;
};

const updateUserById = async (id: IdType, payload: Record<string, any>) => {
  if (payload.hasOwnProperty('location')) {
    payload.location = {
      coordinates: payload.location,
    };
  }
  return await User.findByIdAndUpdate(id, { $set: payload }, { new: true });
};

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
  findUser,
  createUser,
  fetchDetails,
  deleteUser,
  updateUserById,
  addUserDevice,
  removeUserDevice,
  deactivateUser,
};
