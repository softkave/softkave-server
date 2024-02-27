import {
  CollaborationRequestStatusType,
  ICollaborationRequest,
} from '../../mongo/collaboration-request/definitions';
import {getDateString, getDateStringIfExists} from '../../utilities/fns';
import {IBaseContext} from '../contexts/IBaseContext';
import {NotFoundError} from '../errors';
import {extractFields, getFields, publicWorkspaceResourceFields} from '../utils';
import {IPublicCollaborationRequest} from './types';

const publicCollaborationRequestFields = getFields<IPublicCollaborationRequest>({
  ...publicWorkspaceResourceFields,
  to: {
    email: true,
  },
  from: {
    userId: true,
    userName: true,
    workspaceId: true,
    workspaceName: true,
  },
  readAt: getDateStringIfExists,
  statusHistory: {
    status: true,
    date: getDateString,
  },
  sentEmailHistory: {
    reason: true,
    date: getDateString,
  },
  title: true,
  body: true,
  expiresAt: getDateStringIfExists,
});

export function getPublicCollaborationRequest(
  notification: Partial<ICollaborationRequest>
): IPublicCollaborationRequest {
  return extractFields(notification, publicCollaborationRequestFields);
}

export function getPublicCollaborationRequestArray(
  notifications: Array<Partial<ICollaborationRequest>>
): IPublicCollaborationRequest[] {
  return notifications.map(notification =>
    extractFields(notification, publicCollaborationRequestFields)
  );
}

export function isCollaborationRequestAccepted(request: ICollaborationRequest) {
  if (Array.isArray(request.statusHistory)) {
    return !!request.statusHistory.find(status => {
      return status.status === CollaborationRequestStatusType.Accepted;
    });
  }

  return false;
}

export function isRequestAccepted(request: ICollaborationRequest) {
  if (Array.isArray(request.statusHistory)) {
    return !!request.statusHistory.find(status => {
      return status.status === CollaborationRequestStatusType.Accepted;
    });
  }

  return false;
}

export function assertRequest(r?: ICollaborationRequest | null): asserts r {
  if (!r) {
    throw new NotFoundError('Collaboration request not found');
  }
}

export async function assertUpdateRequest(
  context: IBaseContext,
  id: string,
  update: Partial<ICollaborationRequest>
) {
  const r = await context.collaborationRequest.updateCollaborationRequestById(context, id, update);
  assertRequest(r);
  return r;
}
