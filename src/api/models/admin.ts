import { Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Env from "@env";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface IAdminMethods {
  checkPass(password: string): Promise<boolean>;
  getJwt(): string;
}

interface IAdminModel extends Model<IAdmin, {}, IAdminMethods> {
  superAdminExists(): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin, IAdminModel, IAdminMethods>(
  {
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      default: "superAdmin",
      enum: ["superAdmin", "admin"],
    },
  },
  { versionKey: false }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as Error);
  }
});

adminSchema.statics = {
  superAdminExists: async function (): Promise<boolean> {
    return Boolean(await this.findOne({ role: "superAdmin" }));
  },
};

adminSchema.methods = {
  checkPass: async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  },

  getJwt: function (): string {
    const token = jwt.sign({ id: this._id }, Env.ACCESS_TOKEN_SECRET, {
      expiresIn: Env.ACCESS_TOKEN_EXPIRES,
    });
    return token;
  },
};

export const Admin = model<IAdmin, IAdminModel>("Admin", adminSchema, "admins");
