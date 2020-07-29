import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import blockSchema, { IBlockDocument } from "./definitions";

const modelName = "block-v3";
const collectionName = "blocks-v3";

export const getBlockModel = createSingletonFunc(
  (conn: Connection = getDefaultConnection().getConnection()) => {
    return new MongoModel<IBlockDocument>({
      modelName,
      collectionName,
      rawSchema: blockSchema,
      connection: conn,
    });
  }
);

export interface IBlockModel extends MongoModel<IBlockDocument> {}
