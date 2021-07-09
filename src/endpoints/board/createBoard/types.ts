import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { INewBoardInput, IPublicBoard } from "../types";

export interface ICreateBoardParameters {
    board: INewBoardInput;
}

export interface ICreateBoardResult {
    board: IPublicBoard;
}

export type CreateBoardEndpoint = Endpoint<
    IBaseContext,
    ICreateBoardParameters,
    ICreateBoardResult
>;
