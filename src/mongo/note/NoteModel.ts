import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import noteSchema, { INoteDocument } from "./definitions";

export interface INoteModel extends MongoModel<INoteDocument> {}

const modelName = "note";
const collectionName = "notes";

export const getNoteModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<INoteDocument>({
            modelName,
            collectionName,
            rawSchema: noteSchema,
            connection: conn,
        });
    }
);
