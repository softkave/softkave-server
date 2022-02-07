import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    permissionGroupMongoSchema,
    IPermissionGroupDocument,
} from "./definitions";

const modelName = "permission-group";
const collectionName = "permission-groups";

export const getPermissionGroupsModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IPermissionGroupDocument>({
            modelName,
            collectionName,
            rawSchema: permissionGroupMongoSchema,
            connection: conn,
        });
    }
);

export interface IPermissionGroupModel
    extends MongoModel<IPermissionGroupDocument> {}
