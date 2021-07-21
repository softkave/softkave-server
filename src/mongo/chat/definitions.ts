import { Document } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IChat {
    customId: string;
    organizationId: string;
    message: string;
    sender: string;
    roomId: string;
    createdAt: Date;
    updatedAt?: Date;
}

const chatMongoSchema = {
    customId: { type: String, unique: true },
    organizationId: { type: String },
    message: { type: String },
    sender: { type: String },
    roomId: { type: String },
    createdAt: { type: Date, default: getDate },
    updatedAt: { type: Date },
};

export default chatMongoSchema;

export interface IChatDocument extends IChat, Document {}
