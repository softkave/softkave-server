import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import roomSchema, { IRoomDocument } from "./definitions";

export interface IRoomModel extends MongoModel<IRoomDocument> {}

const modelName = "room-v2";
const collectionName = "rooms-v2";

export const getRoomModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IRoomDocument>({
            modelName,
            collectionName,
            rawSchema: roomSchema,
            connection: conn,
        });
    }
);
