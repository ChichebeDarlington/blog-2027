import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: "admin";
  isActive: boolean;
  lastLoginAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin", required: true },
    isActive: { type: Boolean, default: true, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export const User = model<IUser>("User", userSchema);
