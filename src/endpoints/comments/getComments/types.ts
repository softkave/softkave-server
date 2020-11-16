import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicCommentData } from "../types";

export interface IGetCommentsParameters {
    taskId: string;
}

export interface IGetCommentsResult {
    comments: IPublicCommentData[];
}

export type GetCommentsEndpoint = Endpoint<
    IBaseContext,
    IGetCommentsParameters,
    IGetCommentsResult
>;
