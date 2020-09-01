import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import chatsSchema, { IChatDocument } from "./definitions";

export interface IChatModel extends MongoModel<IChatDocument> {}

const modelName = "chat";
const collectionName = "chats";

export const getChatModel = createSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IChatDocument>({
            modelName,
            collectionName,
            rawSchema: chatsSchema,
            connection: conn,
        });
    }
);
