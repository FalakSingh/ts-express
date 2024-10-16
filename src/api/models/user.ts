import { Model, model, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import Env from '@env';
import { generateOtp, jwt } from '@utils';
import { ErrorRes } from '@helpers';

export interface IUser extends Document, IUserMethods {
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  countryCode: string;
  phoneNumber: string;
  image: string;
  otp: string;
  otpExpiresAt: Date;
  isDeleted: boolean;
  isDeactivated: boolean;
  lastLogin: Date;
}

// Put all user instance methods in this interface:
interface IUserMethods {
  checkPass(password: string): Promise<boolean>;
  getAccessToken(): string;
  getResetToken(): string;
  getOtp(): Promise<string>;
  verifyOtp(givenOtp: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
  emailExists(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    fullName: String,
    email: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, select: false },
    countryCode: String,
    phoneNumber: String,
    image: String,
    otp: { type: String, select: false },
    otpExpiresAt: Date,
    lastLogin: Date,
    isDeleted: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// checks if the password is modified if it is then it is hashed before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as Error);
  }
});

userSchema.virtual('profileImageUrl').get(function () {
  return this.image ? Env.BASE_URL + this.image : null;
});

userSchema.statics = {
  emailExists: async function (email: string): Promise<boolean> {
    return Boolean(await this.findOne({ email, isEmailVerified: true, isDeleted: false }));
  },

  findByEmail: async function (email: string): Promise<IUser | null> {
    return await this.findOne({ email, isDeleted: false }).select('+password');
  },
};

userSchema.methods = {
  checkPass: async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  },

  getAccessToken: function (): string {
    return jwt.create({ id: this._id }, Env.ACCESS_TOKEN_SECRET, Env.ACCESS_TOKEN_EXPIRES);
  },
  getResetToken: function (): string {
    return jwt.create({ id: this._id }, Env.ACCESS_TOKEN_SECRET, Env.ACCESS_TOKEN_EXPIRES);
  },
  getOtp: async function (): Promise<string> {
    const otp = generateOtp(4);
    this.otp = otp;
    this.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.save();
    return otp;
  },

  verifyOtp: async function (givenOtp: string): Promise<boolean> {
    if (new Date().getTime() - new Date(this.otpExpiresAt).getTime() > 1000 * 60 * 10)
      throw new ErrorRes(410, 'OTP Expired');
    const isOtpCorrect = this.otp === givenOtp;
    if (isOtpCorrect) this.otp = undefined;
    await this.save();
    return isOtpCorrect;
  },
};

export const User = model<IUser, IUserModel>('User', userSchema, 'users');
