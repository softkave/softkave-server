import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    accessControlPermissionMongoSchema,
    IAccessControlPermissionDocument,
} from "./definitions";

const modelName = "permission";
const collectionName = "permissions";

export const getAccessControlPermissionModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IAccessControlPermissionDocument>({
            modelName,
            collectionName,
            rawSchema: accessControlPermissionMongoSchema,
            connection: conn,
        });
    }
);

export interface IAccessControlPermissionModel
    extends MongoModel<IAccessControlPermissionDocument> {}
