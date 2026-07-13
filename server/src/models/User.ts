import { Schema, model, Document } from "mongoose";

export type Role = "admin" | "operator" | "viewer";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  refreshTokenHash?: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "operator", "viewer"], default: "viewer" },
  refreshTokenHash: { type: String, select: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<UserDocument>("User", userSchema);
