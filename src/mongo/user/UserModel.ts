import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import userSchema, { IUserDocument } from "./definitions";

const modelName = "user-v2";
const collectionName = "users-v2";

export const getUserModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IUserDocument>({
            modelName,
            collectionName,
            rawSchema: userSchema,
            connection: conn,
        });
    }
);

export interface IUserModel extends MongoModel<IUserDocument> {}
