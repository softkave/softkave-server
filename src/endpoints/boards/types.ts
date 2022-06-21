import {
    BlockType,
    IBlockLabel,
    IBlockStatus,
    IBoardStatusResolution,
} from "../../mongo/block";
import { IBoardSprintOptions } from "../../mongo/sprint";
import { ConvertDatesToStrings } from "../../utilities/types";
import { IResourceWithId } from "../types";

export interface IBoard {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    parent: string;
    rootBlockId: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    permissionResourceId?: string;
    color: string;
    publicPermissionGroupId?: string;
    boardStatuses: IBlockStatus[];
    boardLabels: IBlockLabel[];
    boardResolutions: IBoardStatusResolution[];
    currentSprintId?: string;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;
}

export interface IBlockStatusInput extends IResourceWithId {
    name: string;
    color: string;
    position: number;
    description?: string;
}

export interface IBlockLabelInput extends IResourceWithId {
    name: string;
    color: string;
    description?: string;
}

export interface IBoardStatusResolutionInput extends IResourceWithId {
    name: string;
    description?: string;
}

export interface INewBoardInput {
    name: string;
    description?: string;
    color: string;
    parent: string;
    boardStatuses: IBlockStatusInput[];
    boardLabels: IBlockLabelInput[];
    boardResolutions: IBoardStatusResolutionInput[];
}

export type IPublicBoard = ConvertDatesToStrings<{
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType;
    name: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    parent: string;
    rootBlockId: string;
    color: string;
    boardStatuses: Array<ConvertDatesToStrings<IBlockStatus>>;
    boardLabels: ConvertDatesToStrings<IBlockLabel>[];
    boardResolutions: ConvertDatesToStrings<IBoardStatusResolution>[];
    currentSprintId?: string;
    sprintOptions?: IBoardSprintOptions;
    lastSprintId?: string;
}>;
