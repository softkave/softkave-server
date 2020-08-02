import { validate } from "../../../utilities/joiUtils";
import { AddCommentEndpoint } from "./types";
import commentValidationSchemas from "../validation";
import { IComment } from "../../../mongo/comment";
import { getDate } from "../../../utilities/fns";

const addComment: AddCommentEndpoint = async (context, instaData) => {
  const data = validate(
    instaData.data.comment,
    commentValidationSchemas.newComment
  );
  const user = await context.session.getUser(context.models, instaData);

  const now = getDate();
  const comment: IComment = {
    customId: data.customId,
    comment: data.comment,
    taskId: data.taskId,
    createdAt: now,
    createdBy: user.customId,
  };

  const savedComment = await context.comment.createComment(
    context.models,
    comment
  );

  return {
    comment: savedComment,
    error: [],
  };
};

export default addComment;
