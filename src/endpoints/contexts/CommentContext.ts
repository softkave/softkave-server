import { IComment } from "../../mongo/comment";
import mongoConstants from "../../mongo/constants";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";
import { IBaseContext } from "./BaseContext";

export interface ICommentContext {
  createComment: (ctx: IBaseContext, comment: IComment) => Promise<IComment>;
  getComments: (ctx: IBaseContext, taskId: string) => Promise<IComment[]>;
}

export default class CommentContext implements ICommentContext {
  public async createComment(ctx: IBaseContext, comment: IComment) {
    try {
      const c = new ctx.models.commentModel.model(comment);
      await c.save();
      return c;
    } catch (error) {
      logger.error(error);

      if (error.code === mongoConstants.indexNotUniqueErrorCode) {
        // TODO: Implement a way to get a new customId and retry
        throw new ServerError();
      }

      throw new ServerError();
    }
  }

  public async getComments(ctx: IBaseContext, taskId: string) {
    try {
      return await ctx.models.commentModel.model
        .find({
          taskId,
          isDeleted: false,
        })
        .exec();
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }

  // public async getComment() {}

  // public async deleteComment() {}
}

export const getCommentContext = createSingletonFunc(
  () => new CommentContext()
);
