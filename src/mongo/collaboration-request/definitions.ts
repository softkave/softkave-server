import {Connection} from 'mongoose';
import {IWorkspaceResource} from '../../models/resource';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDate} from '../../utilities/fns';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {workspaceResourceSchema} from '../definitions';
import {
  INotificationEmailHistoryItem,
  notificationEmailHistorySchema,
} from '../notification/definitions';
import {ensureMongoSchemaFields} from '../utils';

export interface ICollaborationRequestFrom {
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
}

const collaborationRequestFromSchema = ensureMongoSchemaFields<ICollaborationRequestFrom>({
  userId: {type: String, index: true},
  userName: String,
  workspaceId: {type: String, index: true},
  workspaceName: String,
});

export interface ICollaborationRequestRecipient {
  email: string;
}

const collaborationRequestRecipientSchema = {
  email: {type: String, index: true},
};

export enum CollaborationRequestStatusType {
  Accepted = 'accepted',
  Declined = 'declined',
  Revoked = 'revoked',
  Pending = 'pending',
}

export type CollaborationRequestResponse =
  | CollaborationRequestStatusType.Accepted
  | CollaborationRequestStatusType.Declined;

export interface ICollaborationRequestStatus {
  status: CollaborationRequestStatusType;
  date: Date;
}

const collaborationRequestStatusHistorySchema = {
  status: String,
  date: Date,
};

export enum CollaborationRequestEmailReason {
  RequestNotification = 'requestNotification',
  RequestRevoked = 'requestRevoked',
  RequestUpdated = 'requestUpdated',
}

export interface ICollaborationRequestSentEmailHistoryItem extends INotificationEmailHistoryItem {
  reason: CollaborationRequestEmailReason;
}

export interface ICollaborationRequest extends IWorkspaceResource {
  to: ICollaborationRequestRecipient;
  title: string;
  body?: string;
  from: ICollaborationRequestFrom;
  expiresAt?: Date;
  readAt?: Date;
  statusHistory: Array<ICollaborationRequestStatus>;
  sentEmailHistory: Array<ICollaborationRequestSentEmailHistoryItem>;
}

const collaborationRequestSchema = ensureMongoSchemaFields<ICollaborationRequest>({
  ...workspaceResourceSchema,
  to: {type: collaborationRequestRecipientSchema},
  title: {type: String},
  body: {type: String},
  from: {type: collaborationRequestFromSchema},
  createdAt: {type: Date, default: () => getDate()},
  expiresAt: {type: Date},
  readAt: {type: Date},
  statusHistory: {
    type: [collaborationRequestStatusHistorySchema],
    default: [],
  },
  sentEmailHistory: {
    type: [notificationEmailHistorySchema],
    default: [],
  },
});

const modelName = 'collaboration_request_01';
const collectionName = 'collaboration_requests_01';

export const getCollaborationRequestModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<ICollaborationRequest>({
      modelName,
      collectionName,
      rawSchema: collaborationRequestSchema,
      connection: conn,
    });
  }
);

export type ICollaborationRequestModel = MongoModel<ICollaborationRequest>;
