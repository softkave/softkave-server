import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import { permissionMongoSchema, IPermissionDocument } from "./definitions";

const modelName = "permission";
const collectionName = "permissions";

export const getPermissionModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IPermissionDocument>({
            modelName,
            collectionName,
            rawSchema: permissionMongoSchema,
            connection: conn,
        });
    }
);

export interface IPermissionModel extends MongoModel<IPermissionDocument> {}
