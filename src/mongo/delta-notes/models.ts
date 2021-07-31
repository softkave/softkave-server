import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import { IDeltaNoteItemDocument } from "./definitions";

const deltaNoteItemModelName = "delta-note-item";
const deltaNoteItemCollectionName = "delta-note-items";

export const getDeltaNoteModel = makeSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IDeltaNoteItemDocument>({
            modelName: deltaNoteItemModelName,
            collectionName: deltaNoteItemCollectionName,
            rawSchema: deltaNoteItemModelName,
            connection: conn,
        });
    }
);

export interface IDeltaNoteModel extends MongoModel<IDeltaNoteItemDocument> {}
