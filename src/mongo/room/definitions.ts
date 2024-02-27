import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';

export interface IChatRoomMemberReadCounter {
  userId: string;
  readCounter: Date;
}

const memberWithReadCounterSchema = {
  userId: {type: String},
  readCounter: {type: Date},
};

export interface IChatRoom extends IWorkspaceResource {
  name: string;
  members: Array<IChatRoomMemberReadCounter>;
  lastChatCreatedAt?: Date | string;
}

const chatRoomSchema = {
  ...workspaceResourceSchema,
  name: {type: String, unique: true},
  members: {type: [memberWithReadCounterSchema], index: true},
  lastChatCreatedAt: {type: Date},
};

export type IChatRoomModel = MongoModel<IChatRoom>;

const modelName = 'chat_room_01';
const collectionName = 'chat_rooms_01';

export const getChatRoomModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IChatRoom>({
      modelName,
      collectionName,
      rawSchema: chatRoomSchema,
      connection: conn,
    });
  }
);
