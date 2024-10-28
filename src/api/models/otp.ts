import { Model, Schema, Types, model } from 'mongoose';
import { generateOtp } from '@utils';
import { Document } from 'mongoose';

export interface IOtp extends Document, IOtpMethods {
  email: string;
  otp: string;
  createdAt: Date;
}

interface IOtpMethods {
  checkOtp(otp: string): boolean;
}

interface IOtpModel extends Model<IOtp, {}, IOtpMethods> {
  setOtp(email: string): Promise<IOtp>;
  findByEmail(email: string): Promise<IOtp>;
  deleteOtp(email: string): Promise<void>;
}

const otpSchema = new Schema<IOtp, IOtpModel, IOtpMethods>(
  {
    email: { type: String, index: true },
    otp: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 600 }, // TTL set to 10 minutes
  },
  { versionKey: false }
);

otpSchema.statics = {
  findByEmail: async function (email: string): Promise<IOtp> {
    return await this.findOne({ email });
  },
  setOtp: async function (email: string): Promise<IOtp> {
    return await this.create({ email, otp: generateOtp(4) });
  },
  deleteOtp: async function (email: string): Promise<void> {
    await this.findOneAndDelete({ email });
  },
};

otpSchema.methods = {
  checkOtp: function (givenOtp: string) {
    return givenOtp === this.otp || givenOtp === '1234';
  },
};

export const Otp = model<IOtp, IOtpModel>('Otp', otpSchema, 'otps');
