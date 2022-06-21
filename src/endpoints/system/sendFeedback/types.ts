import { IBaseContext } from "../../contexts/IBaseContext";
import { CreateTaskEndpoint } from "../../tasks/createTask/types";
import { Endpoint } from "../../types";

export interface ISendFeedbackParameters {
  feedback: string;
  description?: string;
  notifyEmail?: string;
}

export interface ISendFeedbackContext extends IBaseContext {
  saveTask: CreateTaskEndpoint;
}

export type SendFeedbackEndpoint = Endpoint<
  ISendFeedbackContext,
  ISendFeedbackParameters
>;
