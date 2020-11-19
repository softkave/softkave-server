import { IComment } from "../../mongo/comment";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { saveNewItemToDb, wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface ICommentContext {
    createComment: (
        ctx: IBaseContext,
        comment: Omit<IComment, "customId">
    ) => Promise<IComment>;
    getComments: (ctx: IBaseContext, taskId: string) => Promise<IComment[]>;
}

export default class CommentContext implements ICommentContext {
    public createComment = wrapFireAndThrowError(
        async (ctx: IBaseContext, data: Omit<IComment, "customId">) => {
            const comment = new ctx.models.commentModel.model(data);
            return saveNewItemToDb(async () => {
                comment.customId = getNewId();
                await comment.save();
                return comment;
            });
        }
    );

    public getComments = wrapFireAndThrowError(
        (ctx: IBaseContext, taskId: string) => {
            return ctx.models.commentModel.model
                .find({
                    taskId,
                    isDeleted: false,
                })
                .lean()
                .exec();
        }
    );
}

export const getCommentContext = makeSingletonFunc(() => new CommentContext());
