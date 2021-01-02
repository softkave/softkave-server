import { IBaseContext } from "../../contexts/BaseContext";
import { IPublicCollaborationRequest } from "../../notifications/types";
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
