import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import taskHistoryItemSchema, { ITaskHistoryItemDocument } from "./definitions";

export interface ITaskHistoryItemModel
    extends MongoModel<ITaskHistoryItemDocument> {}

const modelName = "task-history-item";
const collectionName = "task-history-items";

export const getTaskHistoryItemModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ITaskHistoryItemDocument>({
            modelName,
            collectionName,
            rawSchema: taskHistoryItemSchema,
            connection: conn,
        });
    }
);
