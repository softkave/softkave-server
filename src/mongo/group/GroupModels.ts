import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import groupsSchema, { IGroupDocument } from "./definitions";

export interface IGroupModel extends MongoModel<IGroupDocument> {}

const modelName = "group";
const collectionName = "groups";

export const getGroupModel = createSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IGroupDocument>({
            modelName,
            collectionName,
            rawSchema: groupsSchema,
            connection: conn,
        });
    }
);
