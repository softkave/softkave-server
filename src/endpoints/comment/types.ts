import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicCommentData = ConvertDatesToStrings<{
    customId: string;
    taskId: string;
    comment: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
}>;

export interface INewCommentInput {
    customId: string;
    taskId: string;
    comment: string;
}
