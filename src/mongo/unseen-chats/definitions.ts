import { Document, SchemaTypes } from "mongoose";
import { getDate } from "../../utilities/fns";

export interface IUnseenChats {
    customId: string;
    userId: string;
    rooms: { [key: string]: number };
    createdAt: string;
}

const unseenChatsMongoSchema = {
    customId: { type: String, unique: true, index: true },
    userId: { type: String, unique: true, index: true },
    rooms: { type: SchemaTypes.Mixed },
    createdAt: { type: Date, default: getDate },
};

export default unseenChatsMongoSchema;

export interface IUnseenChatsDocument extends IUnseenChats, Document {}
