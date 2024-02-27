import {Connection} from 'mongoose';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDefaultMongoConnection} from '../defaultConnection';
import MongoModel from '../MongoModel';
import blockSchema, {IBlock} from './definitions';

const modelName = 'block-v4';
const collectionName = 'blocks-v4';

export const getBlockModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IBlock>({
      modelName,
      collectionName,
      rawSchema: blockSchema,
      connection: conn,
    });
  }
);

export type IBlockModel = MongoModel<IBlock>;
