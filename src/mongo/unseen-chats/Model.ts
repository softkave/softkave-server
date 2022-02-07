import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import unseenChatsMongoSchema, { IUnseenChatsDocument } from "./definitions";

export interface IUnseenChatsModel extends MongoModel<IUnseenChatsDocument> {}

const modelName = "unseen-chat";
const collectionName = "unseen-chats";

export const getUnseenChatsModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IUnseenChatsDocument>({
            modelName,
            collectionName,
            rawSchema: unseenChatsMongoSchema,
            connection: conn,
        });
    }
);
