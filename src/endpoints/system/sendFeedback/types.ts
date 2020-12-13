import {
    IInternalAddBlockContext,
    InternalAddBlockEndpoint,
} from "../../block/internalAddBlock/types";
import { Endpoint } from "../../types";

export interface ISendFeedbackParameters {
    feedback: string;
    description?: string;
    notifyEmail?: string;
}

export interface ISendFeedbackContext extends IInternalAddBlockContext {
    saveTask: InternalAddBlockEndpoint;
}

export type SendFeedbackEndpoint = Endpoint<
    ISendFeedbackContext,
    ISendFeedbackParameters
>;
