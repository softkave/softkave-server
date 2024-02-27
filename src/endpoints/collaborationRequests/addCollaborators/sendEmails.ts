import {
  CollaborationRequestEmailReason,
  ICollaborationRequest,
} from '../../../mongo/collaboration-request/definitions';
import {IUser} from '../../../mongo/user/definitions';
import {getDate} from '../../../utilities/fns';
import {IUpdateItemById} from '../../../utilities/types';
import {IPromiseWithId, waitOnPromisesWithId} from '../../../utilities/waitOnPromises';
import {fireAndForgetPromise} from '../../utils';
import {IPublicCollaborationRequest} from '../types';
import {getPublicCollaborationRequest} from '../utils';
import {IAddCollaboratorsContext} from './types';

export interface IAddCollaboratorsSendEmailsFnProps {
  user: IUser;
  indexedExistingUsers: {[key: string]: IUser};
  requests: ICollaborationRequest[];
}

export default async function sendEmails(
  context: IAddCollaboratorsContext,
  data: IAddCollaboratorsSendEmailsFnProps
) {
  const {user, indexedExistingUsers, requests} = data;

  // TODO: should we send emails only to people who aren't users?
  const sendEmailPromises: IPromiseWithId[] = requests.map((request, index) => {
    const promise = context.sendCollaborationRequestEmail(context, {
      email: request.to.email,
      workspaceName: request.from.workspaceName,
      loginLink: context.appVariables.loginPath,
      isRecipientAUser: !!indexedExistingUsers[request.to.email],
      signupLink: context.appVariables.signupPath,
    });

    return {
      promise,
      id: index,
    };
  });

  // TODO: Resend collaboration requests that have not been sent or that failed

  const settledPromises = await waitOnPromisesWithId(sendEmailPromises);
  const successfulRequests: ICollaborationRequest[] = settledPromises
    .filter(({resolved}) => resolved)
    .map(({id}) => {
      return requests[id as number];
    });

  const socketUpdates: Array<IUpdateItemById<IPublicCollaborationRequest>> = [];
  successfulRequests.forEach(req => {
    const sentEmailHistory = req.sentEmailHistory.concat({
      date: getDate(),
      reason: CollaborationRequestEmailReason.RequestNotification,
    });

    socketUpdates.push({
      id: req.customId,
      data: getPublicCollaborationRequest({
        sentEmailHistory,
      }),
    });

    // TODO: we should preferrably bulk update, but bulk update is not
    // working because of something about atomic operators not being present.
    // Should look into this, and find solutions.
    // I also noticed it mostly for arrays, cause sprint bulk updates work just
    // fine for scalar values, though I haven't tested array updates in sprint bulk updates
    fireAndForgetPromise(
      context.collaborationRequest.updateCollaborationRequestById(context, req.customId, {
        sentEmailHistory,
      })
    );
  });
}
