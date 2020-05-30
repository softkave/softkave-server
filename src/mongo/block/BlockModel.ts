import { Connection } from "mongoose";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import blockSchema, { IBlockDocument } from "./definitions";

const modelName = "block-v3";
const collectionName = "blocks-v3";

let blockModel: IBlockModel = null;

export function getBlockModel(
  conn: Connection = getDefaultConnection().getConnection()
) {
  if (blockModel) {
    return blockModel;
  }

  blockModel = new MongoModel<IBlockDocument>({
    modelName,
    collectionName,
    rawSchema: blockSchema,
    connection: conn,
  });

  return blockModel;
}

export interface IBlockModel extends MongoModel<IBlockDocument> {}
