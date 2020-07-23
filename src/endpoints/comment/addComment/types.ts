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

export interface IAddCommentContext extends IBaseContext {}

export type AddComentEndpoint = Endpoint<
  IAddCommentContext,
  IAddCommentParameters
>;
