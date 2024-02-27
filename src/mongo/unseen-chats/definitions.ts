import {Connection, SchemaTypes} from 'mongoose';
import {IResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {resourceSchema} from '../definitions';

export const unseenChatsSchemaV1 = 1;

export interface IUnseenChats extends IResource {
  userId: string;
  rooms: {[key: string]: number};
}

const unseenChatsMongoSchema = {
  ...resourceSchema,
  userId: {type: String, unique: true, index: true},
  rooms: {type: SchemaTypes.Mixed},
};

export type IUnseenChatsModel = MongoModel<IUnseenChats>;

const modelName = 'unseen_chat_01';
const collectionName = 'unseen_chats_01';

export const getUnseenChatsModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IUnseenChats>({
      modelName,
      collectionName,
      rawSchema: unseenChatsMongoSchema,
      connection: conn,
    });
  }
);
