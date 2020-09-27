import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IChat {
    customId: string;
    orgId: string;
    message: string;
    sender: string;
    roomId: string;
    createdAt: Date;
    updatedAt?: Date;
}

const chatsSchema = {
    customId: { type: String, unique: true },
    orgId: { type: String },
    message: { type: String },
    sender: { type: String },
    roomId: { type: String },
    createdAt: { type: Date, default: getDate },
    updatedAt: { type: Date },
};

export default chatsSchema;
export interface IChatDocument extends IChat, Document {}
