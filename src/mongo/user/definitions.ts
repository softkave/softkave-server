import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export const userSchemaVersion = 2; // increment when you make changes that are not backward compatible

export interface IUserOrg {
    customId: string;
}

export const userOrgSchema = {
    customId: { type: String, index: true },
};

export interface IUser {
    customId: string;
    name: string;
    email: string;
    hash: string;
    createdAt: Date;
    forgotPasswordHistory: Date[];
    passwordLastChangedAt: Date;
    rootBlockId: string;
    orgs: IUserOrg[];
    color: string;
    notificationsLastCheckedAt?: Date;
}

export interface IUserDocument extends Document, IUser {}

const userSchema = {
    customId: { type: String, unique: true, index: true },
    name: { type: String },
    email: { type: String, unique: true, index: true },
    hash: { type: String },
    createdAt: { type: Date, default: () => getDate() },
    forgotPasswordHistory: { type: [Date] },
    passwordLastChangedAt: { type: Date },
    rootBlockId: { type: String },
    orgs: { type: [userOrgSchema] },
    color: { type: String },
    notificationsLastCheckedAt: { type: Date },
};

export default userSchema;
