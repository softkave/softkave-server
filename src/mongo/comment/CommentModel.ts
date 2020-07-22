import { Connection } from "mongoose";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import commentSchema, { ICommentDocument } from "./definitions";

export interface ICommentModel extends MongoModel<ICommentDocument> {}

const modelName = "comment";
const collectionName = "comments";

let commentModel: ICommentModel = null;

export function getCommentModel(
  conn: Connection = getDefaultConnection().getConnection()
) {
  if (commentModel) {
    return commentModel;
  }

  commentModel = new MongoModel<ICommentDocument>({
    modelName,
    collectionName,
    rawSchema: commentSchema,
    connection: conn,
  });

  return commentModel;
}
