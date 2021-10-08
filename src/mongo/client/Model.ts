import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import clientMongoSchema, { IClientDocument } from "./definitions";

export interface IClientModel extends MongoModel<IClientDocument> {}

const modelName = "client";
const collectionName = "clients";

export const getClientModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IClientDocument>({
            modelName,
            collectionName,
            rawSchema: clientMongoSchema,
            connection: conn,
        });
    }
);
