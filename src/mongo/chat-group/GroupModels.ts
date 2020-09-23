import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import groupChatsSchema, { IGroupChatDocument } from "./definitions";

export interface IGroupModel extends MongoModel<IGroupChatDocument> {}

const modelName = "chat-groups";
const collectionName = "chat-groups";

export const getGroupModel = createSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IGroupChatDocument>({
            modelName,
            collectionName,
            rawSchema: groupChatsSchema,
            connection: conn,
        });
    }
);
