import { IPublicCollaborationRequest } from "../../collaborationRequest/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { Endpoint } from "../../types";

export interface IGetBlockNotificationsParameters {
    blockId: string;
}

export interface IGetBlockNotificationsResult {
    requests: IPublicCollaborationRequest[];
}

export type GetBlockNotificationsEndpoint = Endpoint<
    IBaseContext,
    IGetBlockNotificationsParameters,
    IGetBlockNotificationsResult
>;
