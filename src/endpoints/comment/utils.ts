import { IComment } from "../../mongo/comment";
import { IPublicCommentData } from "./types";

export function toPublicCommentData(comment: IComment): IPublicCommentData {
  return {
    customId: comment.customId,
    taskId: comment.taskId,
    comment: comment.comment,
    createdBy: comment.createdBy,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    updatedBy: comment.updatedBy,
  };
}
