import { Connection } from "mongoose";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import { IJobDocument, jobMongoSchema } from "./definitions";

export interface IJobModel extends MongoModel<IJobDocument> {}

const modelName = "job";
const collectionName = "jobs";

export const getJobModel = getSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IJobDocument>({
            modelName,
            collectionName,
            rawSchema: jobMongoSchema,
            connection: conn,
        });
    }
);
