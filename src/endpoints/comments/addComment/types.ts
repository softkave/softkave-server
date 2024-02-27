import {IBaseContext} from '../../contexts/IBaseContext';
import {Endpoint} from '../../types';
import {INewCommentInput, IPublicCommentData} from '../types';

export interface IAddCommentParameters {
  comment: INewCommentInput;
}

export interface IAddCommentResult {
  comment: IPublicCommentData;
}

export type AddCommentEndpoint = Endpoint<IBaseContext, IAddCommentParameters, IAddCommentResult>;
