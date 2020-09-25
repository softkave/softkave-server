import { IChat } from "../../../mongo/chat";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface IGetMessagesParameters {
    orgId: string;
    roomIds: string[];
}

export type GetMessagesEndpoint = Endpoint<
    IBaseContext,
    IGetMessagesParameters,
    IChat[]
>;
