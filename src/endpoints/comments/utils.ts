import { IComment } from "../../mongo/comment";
import { getDateString } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicCommentData } from "./types";

const publicCommentFields = getFields<IPublicCommentData>({
    customId: true,
    taskId: true,
    comment: true,
    createdBy: true,
    createdAt: getDateString,
    updatedAt: getDateString,
    updatedBy: true,
});

export function getPublicCommentData(comment: IComment): IPublicCommentData {
    return extractFields(comment, publicCommentFields);
}

export function getPublicCommentsArray(
    comments: IComment[]
): IPublicCommentData[] {
    return comments.map((comment) =>
        extractFields(comment, publicCommentFields)
    );
}
