import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    freezedPermissionMongoSchema,
    IFreezedPermissionDocument,
} from "./definitions";

const modelName = "freezedPermission";
const collectionName = "freezedPermissions";

export const getFreezedPermissionsModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IFreezedPermissionDocument>({
            modelName,
            collectionName,
            rawSchema: freezedPermissionMongoSchema,
            connection: conn,
        });
    }
);

export interface IFreezedPermissionsModel
    extends MongoModel<IFreezedPermissionDocument> {}
