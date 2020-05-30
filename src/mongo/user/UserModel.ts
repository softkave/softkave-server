import { Connection } from "mongoose";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import userSchema, { IUserDocument } from "./definitions";

const modelName = "user-v2";
const collectionName = "users-v2";

let userModel: IUserModel = null;

export function getUserModel(
  conn: Connection = getDefaultConnection().getConnection()
) {
  if (userModel) {
    return userModel;
  }

  userModel = new MongoModel<IUserDocument>({
    modelName,
    collectionName,
    rawSchema: userSchema,
    connection: conn,
  });

  return userModel;
}

export interface IUserModel extends MongoModel<IUserDocument> {}
