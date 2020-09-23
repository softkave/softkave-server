import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IGroupChat {
    customId: string;
    orgId: string;
    members: string[];
    isPrivate: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const groupChatsSchema = {
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
    updatedAt: { type: Date },
};

export default groupChatsSchema;
export interface IGroupChatDocument extends IGroupChat, Document {}
