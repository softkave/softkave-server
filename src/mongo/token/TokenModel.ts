import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import tokenMongoSchema, { ITokenDocument } from "./definitions";

export interface ITokenModel extends MongoModel<ITokenDocument> {}

const modelName = "token";
const collectionName = "tokens";

export const getTokenModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ITokenDocument>({
            modelName,
            collectionName,
            rawSchema: tokenMongoSchema,
            connection: conn,
        });
    }
);
