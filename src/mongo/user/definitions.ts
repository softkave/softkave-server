import { Document } from "mongoose";

export const userSchemaVersion = 2; // increment when you make changes that are not backward compatible

export interface IUser0 {
  customId: string;
  name: string;
  email: string;
  hash: string;
  createdAt: number;
  forgotPasswordHistory: number[];
  changePasswordHistory: number[];
  lastNotificationCheckTime: number;
  rootBlockId: string;
  orgs: string[];
  color: string;
}

export interface IUserOrg {
  customId: string;
}

export const userOrgSchema = {
  customId: { type: String },
};

export interface IUser {
  customId: string;
  name: string;
  email: string;
  hash: string;
  createdAt: string;
  forgotPasswordHistory: string[];
  passwordLastChangedAt: string;
  rootBlockId: string;
  orgs: IUserOrg[];
  color: string;
  notificationsLastCheckedAt?: string;
}

export interface IUserDocument extends Document, IUser {}

export const userSchema0 = {
  customId: { type: String, unique: true },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
  },
  hash: {
    type: String,
    index: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  forgotPasswordHistory: [Number],
  changePasswordHistory: [Number],
  lastNotificationCheckTime: Number,
  rootBlockId: String,
  orgs: [String],
  color: String,
  changePasswordTokenIDs: [String],
};

const userSchema = {
  customId: { type: String, unique: true },
  name: { type: String },
  email: { type: String, unique: true },
  hash: { type: String },
  createdAt: { type: String },
  forgotPasswordHistory: { type: [Number] },
  passwordLastChangedAt: { type: String },
  rootBlockId: { type: String },
  orgs: { type: [userOrgSchema] },
  color: { type: String },
  notificationsLastCheckedAt: { type: Number },
};

export default userSchema;
