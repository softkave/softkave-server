import { Document } from "mongoose";

export interface IAccessControlItem {
  orgId: string;
  actionName: string;
  permittedRoles: string[];
}

export interface IAccessControlDocument extends Document, IAccessControlItem {}

const accessControlSchema = {
  orgId: { type: String, unique: true },
  actionName: { type: String, index: true },
  permittedRoles: { type: [String], index: true }
};

export default accessControlSchema;
