import { IComment } from "../../../mongo/comment";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { INewCommentInput } from "../types";

export interface IAddCommentParameters {
  comment: INewCommentInput;
}

export interface IAddCommentResult {
  comment: IComment;
}

export type AddCommentEndpoint = Endpoint<
  IBaseContext,
  IAddCommentParameters,
  IAddCommentResult
>;
