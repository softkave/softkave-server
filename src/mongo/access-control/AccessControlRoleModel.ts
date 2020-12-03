import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import {
    accessControlRoleMongoSchema,
    IAccessControlRoleDocument,
} from "./definitions";

const modelName = "role";
const collectionName = "roles";

export const getAccessControlRoleModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IAccessControlRoleDocument>({
            modelName,
            collectionName,
            rawSchema: accessControlRoleMongoSchema,
            connection: conn,
        });
    }
);

export interface IAccessControlRoleModel
    extends MongoModel<IAccessControlRoleDocument> {}
