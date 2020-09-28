import { Connection } from "mongoose";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
<<<<<<< HEAD:src/mongo/chat-group/GroupModels.ts
import groupChatsSchema, { IGroupChatDocument } from "./definitions";

export interface IGroupModel extends MongoModel<IGroupChatDocument> {}

const modelName = "chat-groups";
const collectionName = "chat-groups";
=======
import roomSchema, { IRoomDocument } from "./definitions";

export interface IRoomModel extends MongoModel<IRoomDocument> {}

const modelName = "room";
const collectionName = "rooms";
>>>>>>> 89c2dd1793992c4c6d15b45ee883ae8af977a554:src/mongo/room/RoomModels.ts

export const getRoomModel = createSingletonFunc(
    (conn: Connection = getDefaultConnection().getConnection()) => {
<<<<<<< HEAD:src/mongo/chat-group/GroupModels.ts
        return new MongoModel<IGroupChatDocument>({
            modelName,
            collectionName,
            rawSchema: groupChatsSchema,
=======
        return new MongoModel<IRoomDocument>({
            modelName,
            collectionName,
            rawSchema: roomSchema,
>>>>>>> 89c2dd1793992c4c6d15b45ee883ae8af977a554:src/mongo/room/RoomModels.ts
            connection: conn,
        });
    }
);
