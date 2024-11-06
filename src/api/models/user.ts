import { Model, model, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import Env from '@env';
import { jwt } from '@utils';

export type Device = {
  deviceType: 'Android' | 'iOS';
  deviceToken: string;
  deviceId: string;
  loginTimeStamp: Date;
};

export interface IUser extends Document, IUserMethods {
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  countryCode: string;
  phoneNumber: string;
  image: string;
  isDeleted: boolean;
  isDeactivated: boolean;
  lastLogin: Date;
  notificationsEnabled: boolean;
  devices: Array<Device>;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

// Put all user instance methods in this interface:
interface IUserMethods {
  checkPass(password: string): Promise<boolean>;
  getAccessToken(): string;
  getResetToken(): string;
  updateLastLogin(): void;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
  emailExists(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    fullName: String,
    email: { type: String, required: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, select: false },
    countryCode: String,
    phoneNumber: String,
    image: String,
    lastLogin: Date,
    isDeleted: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    devices: [
      {
        _id: false,
        deviceType: { type: String, enum: ['Android', 'iOS'], required: true },
        deviceToken: { type: String, required: true },
        deviceId: { type: String, required: true },
        loginTimeStamp: { type: Date, default: Date.now },
      },
    ],
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
    return jwt.create({ id: this._id }, Env.RESET_TOKEN_SECRET, Env.RESET_TOKEN_EXPIRES);
  },
  updateLastLogin: function () {
    this.lastLogin = new Date();
  },
};

export const User = model<IUser, IUserModel>('User', userSchema, 'users');
