import Env from '@env';
import { Admin } from '@models';

const checkIfSuperAdminExists = async () => await Admin.superAdminExists();

const findAdminByEmail = async (email: string) => await Admin.findOne({ email }).select('+password');

const createAdmin = async () => {
  await Admin.create({
    email: Env.ADMIN_EMAIL,
    password: Env.ADMIN_PASSWORD,
  });
};

export { checkIfSuperAdminExists, createAdmin, findAdminByEmail };
