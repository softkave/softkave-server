import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import roomSchema, { IRoomDocument } from "./definitions";

export interface IRoomModel extends MongoModel<IRoomDocument> {}

const modelName = "room";
const collectionName = "rooms";

export const getRoomModel = createSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IRoomDocument>({
            modelName,
            collectionName,
            rawSchema: roomSchema,
            connection: conn,
        });
    }
);
