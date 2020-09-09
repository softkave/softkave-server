import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetChatListParameters {
    customId: string;
    orgId: string;
}

export type PrivateChatListEndpoint = Endpoint<
    IBaseContext,
    IGetChatListParameters
>;
