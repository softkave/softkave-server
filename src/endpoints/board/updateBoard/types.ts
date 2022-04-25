import { SprintDuration } from "../../../mongo/sprint";
import { IUser } from "../../../mongo/user";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint, IUpdateComplexTypeArrayInput } from "../../types";
import {
    IBlockLabelInput,
    IBlockStatusInput,
    IBoardStatusResolutionInput,
    IPublicBoard,
} from "../types";

export interface IUpdateBoardInput {
    name?: string;
    description?: string;
    color?: string;
    boardStatuses?: IUpdateComplexTypeArrayInput<IBlockStatusInput>;
    boardLabels?: IUpdateComplexTypeArrayInput<IBlockLabelInput>;
    boardResolutions?: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>;
    sprintOptions?: {
        duration: SprintDuration;
    };
}

export interface IUpdateBoardParameters {
    boardId: string;
    data: IUpdateBoardInput;
}

export interface IUpdateBoardContext extends IBaseContext {
    bulkUpdateDeletedStatusInTasks: (
        ctx: IBaseContext,
        boardId: string,
        items: Array<{ oldId: string; newId: string }>,
        user: IUser
    ) => Promise<void>;
    bulkUpdateDeletedResolutionsInTasks: (
        ctx: IBaseContext,
        boardId: string,
        ids: string[]
    ) => Promise<void>;
    bulkRemoveDeletedLabelsInTasks: (
        ctx: IBaseContext,
        boardId: string,
        ids: string[]
    ) => Promise<void>;
}

export type UpdateBoardEndpoint = Endpoint<
    IUpdateBoardContext,
    IUpdateBoardParameters,
    { board: IPublicBoard }
>;
