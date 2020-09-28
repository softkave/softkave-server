import { IChat } from "../../../mongo/chat";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISendMessageParameters {
    orgId: string;
    message: string;
    roomId?: string;
    recipientId?: string;
}

export interface ISendMessageEndpointResult {
    chat: IChat;
}

export type SendMessageEndpoint = Endpoint<
    IBaseContext,
    ISendMessageParameters,
    ISendMessageEndpointResult
>;
