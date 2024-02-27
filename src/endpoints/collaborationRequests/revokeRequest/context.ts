import {IBaseContext} from '../../contexts/IBaseContext';
import sendCollaborationRequestRevokedEmail from '../sendCollaborationRequestRevokedEmail';
import {IRevokeCollaborationRequestContext} from './types';

export function makeRevokeRequestContext(
  context: IBaseContext
): IRevokeCollaborationRequestContext {
  return {
    ...context,

    async sendCollaborationRequestRevokedEmail(context, props) {
      return sendCollaborationRequestRevokedEmail(context, props);
    },
  };
}
