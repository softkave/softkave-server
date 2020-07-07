import { Connection } from "mongoose";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import noteSchema, { INoteDocument } from "./definitions";

export interface INoteModel extends MongoModel<INoteDocument> {}

const modelName = "note";
const collectionName = "notes";

let noteModel: INoteModel = null;

export function getNoteModel(
  conn: Connection = getDefaultConnection().getConnection()
) {
  if (noteModel) {
    return noteModel;
  }

  noteModel = new MongoModel<INoteDocument>({
    modelName,
    collectionName,
    rawSchema: noteSchema,
    connection: conn,
  });

  return noteModel;
}
