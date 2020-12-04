import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import chatMongoSchema, { IChatDocument } from "./definitions";

export interface IChatModel extends MongoModel<IChatDocument> {}

const modelName = "chat";
const collectionName = "chats";

export const getChatModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IChatDocument>({
            modelName,
            collectionName,
            rawSchema: chatMongoSchema,
            connection: conn,
        });
    }
);
