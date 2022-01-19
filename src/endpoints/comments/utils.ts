import { IComment } from "../../mongo/comment";
import { getDateStringIfExists } from "../../utilities/fns";
import { extractFields, getFields } from "../utils";
import { IPublicCommentData } from "./types";

const publicCommentFields = getFields<IPublicCommentData>({
    customId: true,
    taskId: true,
    comment: true,
    createdBy: true,
    createdAt: getDateStringIfExists,
    updatedAt: getDateStringIfExists,
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
