import {SystemResourceType} from '../../models/system';
import {IComment} from '../../mongo/comment/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getNewId02} from '../../utilities/ids';
import {saveNewItemToDb} from '../utils';
import {IBaseContext} from './IBaseContext';

export interface ICommentContext {
  createComment: (ctx: IBaseContext, comment: Omit<IComment, 'customId'>) => Promise<IComment>;
  getComments: (ctx: IBaseContext, taskId: string) => Promise<IComment[]>;
}

export default class CommentContext implements ICommentContext {
  createComment = async (ctx: IBaseContext, data: Omit<IComment, 'customId'>) => {
    const comment = new ctx.models.comment.model(data);
    return saveNewItemToDb(async () => {
      comment.customId = getNewId02(SystemResourceType.Comment);
      await comment.save();
      return comment;
    });
  };

  getComments = (ctx: IBaseContext, taskId: string) => {
    return ctx.models.comment.model
      .find({
        taskId,
        isDeleted: false,
      })
      .lean()
      .exec();
  };
}

export const getCommentContext = makeSingletonFn(() => new CommentContext());
