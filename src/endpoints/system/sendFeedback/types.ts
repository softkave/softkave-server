import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';

export interface ISendFeedbackParameters {
  feedback: string;
  description?: string;
  notifyEmail?: string;
}

export type SendFeedbackEndpoint = Endpoint<IBaseContext, ISendFeedbackParameters>;
