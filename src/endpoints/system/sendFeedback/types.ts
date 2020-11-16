import { InternalAddBlockEndpoint } from "../../block/internalAddBlock/types";
import { IBaseContext } from "../../contexts/BaseContext";
import { Endpoint } from "../../types";

export interface ISendFeedbackParameters {
    title: string;
    message?: string;
}

export interface ISendFeedbackContext extends IBaseContext {
    saveTask: InternalAddBlockEndpoint;
}

export type SendFeedbackEndpoint = Endpoint<
    ISendFeedbackContext,
    ISendFeedbackParameters
>;
