import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";
import { IPublicChatData } from "../types";

export interface ISendMessageParameters {
    orgId: string;
    message: string;
    roomId?: string;
    recipientId?: string;
}

export interface ISendMessageEndpointResult {
    chat: IPublicChatData;
}

export type SendMessageEndpoint = Endpoint<
    IBaseContext,
    ISendMessageParameters,
    ISendMessageEndpointResult
>;
