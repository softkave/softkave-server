import { IBlock } from "../../../mongo/block";
import {
    initializeBoardPermissions,
    initializeOrganizationAccessControl,
} from "../../accessControl/initializeBlockPermissions";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";
import { INewBlockInput } from "../types";

export interface IInternalAddBlockNewBlockInput extends INewBlockInput {
    statusAssignedBy?: string;
}

export interface IInternalAddBlockParameters {
    block: IInternalAddBlockNewBlockInput;
}

export interface IInternalAddBlockResult {
    block: IBlock;
}

export interface IInternalAddBlockContext extends IBaseContext {
    initializeBoardPermissions: typeof initializeBoardPermissions;
    initializeOrganizationAccessControl: typeof initializeOrganizationAccessControl;
}

export type InternalAddBlockEndpoint = Endpoint<
    IInternalAddBlockContext,
    IInternalAddBlockParameters,
    IInternalAddBlockResult
>;
