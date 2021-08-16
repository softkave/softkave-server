import { Connection } from "mongoose";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    IUserAssignedPermissionGroupDocument,
    userAssignedPermissionGroupMongoSchema,
} from "./definitions";

const modelName = "user-assigned-permission-group";
const collectionName = "user-assigned-permission-groups";

export const getUserAssignedPermissionGroupsModel = getSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IUserAssignedPermissionGroupDocument>({
            modelName,
            collectionName,
            rawSchema: userAssignedPermissionGroupMongoSchema,
            connection: conn,
        });
    }
);

export interface IUserAssignedPermissionGroupModel
    extends MongoModel<IUserAssignedPermissionGroupDocument> {}
