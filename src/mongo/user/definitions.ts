import { Document } from "mongoose";

export interface IUserRole {
  roleName: string;
  orgId: string;
  assignedAt: number;
  assignedBy: string;
}

const userRoleSchema = {
  roleName: String,
  orgId: String,
  assignedAt: Number,
  assignedBy: String
};

export interface IUser {
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
  roles: IUserRole[];
}

export interface IUserDocument extends Document, IUser {}

const userSchema = {
  customId: { type: String, unique: true },
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    index: true
  },
  hash: {
    type: String,
    index: true
  },
  createdAt: {
    type: Number,
    default: Date.now
  },
  forgotPasswordHistory: [Number],
  changePasswordHistory: [Number],
  lastNotificationCheckTime: Number,
  rootBlockId: String,
  orgs: [String],
  color: String,
  roles: [userRoleSchema],
  changePasswordTokenIDs: [String]
};

export default userSchema;
