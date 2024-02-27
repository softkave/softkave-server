import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';

export interface IComment extends IWorkspaceResource {
  taskId: string;
  comment: string;
}

const commentsSchema = {
  ...workspaceResourceSchema,
  taskId: {type: String},
  comment: {type: String},
};

export type ICommentModel = MongoModel<IComment>;

const modelName = 'comment_01';
const collectionName = 'comments_01';

export const getCommentModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<IComment>({
      modelName,
      collectionName,
      rawSchema: commentsSchema,
      connection: conn,
    });
  }
);
