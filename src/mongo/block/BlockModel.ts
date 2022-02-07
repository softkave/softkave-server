import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import blockSchema, { IBlockDocument } from "./definitions";

const modelName = "block-v4";
const collectionName = "blocks-v4";

export const getBlockModel = makeSingletonFn(
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
