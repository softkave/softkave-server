import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IGroup {
    customId: string;
    orgId: string;
    members: string[];
    isPrivate: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const groupsSchema = {
    customId: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
    },
    members: { type: [String] },
    isPrivate: Boolean,
    orgId: { type: String },
    createdAt: { type: Date, default: getDate },
    updatedAt: { type: Date, default: getDate },
};

export default groupsSchema;
export interface IGroupDocument extends IGroup, Document {}
