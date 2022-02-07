import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import sprintSchema, { ISprintDocument } from "./definitions";

export interface ISprintModel extends MongoModel<ISprintDocument> {}

const modelName = "sprint";
const collectionName = "sprints";

export const getSprintModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ISprintDocument>({
            modelName,
            collectionName,
            rawSchema: sprintSchema,
            connection: conn,
        });
    }
);
