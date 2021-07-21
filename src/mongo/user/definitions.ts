import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export const userSchemaVersion = 2; // increment when you make changes that are not backward compatible

export interface IUserOrganization {
    customId: string;
}

export const userOrganizationSchema = {
    customId: { type: String, index: true },
};

export interface IUser {
    customId: string;
    name: string;
    email: string;
    hash: string;
    createdAt: string;
    forganizationotPasswordHistory: string[];
    passwordLastChangedAt: string;
    rootBlockId: string;
    organizations: IUserOrganization[];
    color: string;
    notificationsLastCheckedAt?: string;
}

export interface IUserDocument extends Document, IUser {}

const userSchema = {
    customId: { type: String, unique: true, index: true },
    name: { type: String },
    email: { type: String, unique: true, index: true },
    hash: { type: String },
    createdAt: { type: Date, default: () => getDate() },
    forganizationotPasswordHistory: { type: [Date] },
    passwordLastChangedAt: { type: Date },
    rootBlockId: { type: String },
    organizations: { type: [userOrganizationSchema] },
    color: { type: String },
    notificationsLastCheckedAt: { type: Date },
};

export default userSchema;
