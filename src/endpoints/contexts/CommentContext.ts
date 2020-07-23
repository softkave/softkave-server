import { IComment, ICommentModel } from "../../mongo/comment";
import { ServerError } from "../../utilities/errors";
import logger from "../../utilities/logger";

export interface ICommentContextModel {
  commentModel: ICommentModel;
}

export interface ICommentContext {
  createComment: (
    models: ICommentContextModel,
    comment: IComment
  ) => Promise<IComment>;
}

export default class CommentContext implements ICommentContext {
  public async createComment(models, comment: IComment) {
    try {
      const c = new models.commentModel.model(comment);
      c.save();
      return comment;
    } catch (error) {
      logger.error(error);
      throw new ServerError();
    }
  }
}
