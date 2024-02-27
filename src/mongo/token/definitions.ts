import {Connection, SchemaTypes} from 'mongoose';
import {IResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {resourceSchema} from '../definitions';

export const tokenSchemaV1 = 1;

export interface IToken extends IResource {
  userId: string;
  version: number;

  // TODO: rename to scope
  audience: Array<string>;

  // not same as expires in encoded token. expires here is in milliseconds,
  // where expires in encoded token is in seconds
  expires?: number;
  meta?: Record<string, string | number | boolean | null>;
  clientId?: string;
}

const tokenMongoSchema = {
  ...resourceSchema,
  userId: {type: String},
  version: {type: Number},
  issuedAt: {type: Date},
  audience: {type: [String]},
  expires: {type: Number},
  meta: {type: SchemaTypes.Mixed},
  clientId: {type: String},
};

export type ITokenModel = MongoModel<IToken>;

const modelName = 'token_01';
const collectionName = 'tokens_01';

export const getTokenModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IToken>({
      modelName,
      collectionName,
      rawSchema: tokenMongoSchema,
      connection: conn,
    });
  }
);
