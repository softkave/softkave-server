import { IComment } from "../../mongo/comment";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import getNewId from "../../utilities/getNewId";
import { saveNewItemToDb, wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./IBaseContext";

export interface ICommentContext {
    createComment: (
        ctx: IBaseContext,
        comment: Omit<IComment, "customId">
    ) => Promise<IComment>;
    getComments: (ctx: IBaseContext, taskId: string) => Promise<IComment[]>;
}

export default class CommentContext implements ICommentContext {
    public createComment = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, data: Omit<IComment, "customId">) => {
            const comment = new ctx.models.commentModel.model(data);
            return saveNewItemToDb(async () => {
                comment.customId = getNewId();
                await comment.save();
                return comment;
            });
        }
    );

    public getComments = wrapFireAndThrowErrorAsync(
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

export const getCommentContext = makeSingletonFn(() => new CommentContext());
