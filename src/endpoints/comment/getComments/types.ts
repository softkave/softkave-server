import { IComment } from "../../../mongo/comment";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetCommentsParameters {
  taskId: string;
}

export interface IGetCommentsResult {
  comments: IComment[];
}

export type GetCommentsEndpoint = Endpoint<
  IBaseContext,
  IGetCommentsParameters,
  IGetCommentsResult
>;
