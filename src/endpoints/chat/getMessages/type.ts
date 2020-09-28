import { IChat } from "../../../mongo/chat";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetMessagesParameters {
    orgId: string;
    roomIds: string[];
}

export interface IGetMessagesEndpointResult {
    chats: IChat[];
}

export type GetMessagesEndpoint = Endpoint<
    IBaseContext,
    IGetMessagesParameters,
    IGetMessagesEndpointResult
>;
