import { Connection } from "mongoose";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import commentSchema, { ICommentDocument } from "./definitions";

export interface ICommentModel extends MongoModel<ICommentDocument> {}

const modelName = "comment";
const collectionName = "comments";

export const getCommentModel = getSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ICommentDocument>({
            modelName,
            collectionName,
            rawSchema: commentSchema,
            connection: conn,
        });
    }
);
