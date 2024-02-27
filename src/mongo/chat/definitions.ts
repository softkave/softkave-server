import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';

export interface IChat extends IWorkspaceResource {
  message: string;
  roomId: string;
}

const chatMongoSchema = {
  ...workspaceResourceSchema,
  message: {type: String},
  roomId: {type: String},
};

export type IChatModel = MongoModel<IChat>;

const modelName = 'chat_01';
const collectionName = 'chats_01';

export const getChatModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IChat>({
      modelName,
      collectionName,
      rawSchema: chatMongoSchema,
      connection: conn,
    });
  }
);
