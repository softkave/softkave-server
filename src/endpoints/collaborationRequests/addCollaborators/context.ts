import {IBaseContext} from '../../contexts/IBaseContext';
import sendCollaborationRequestsEmail from '../sendCollaborationRequestEmail';
import {IAddCollaboratorsContext} from './types';

export function makeAddCollaboratorContext(context: IBaseContext): IAddCollaboratorsContext {
  return {
    ...context,

    async sendCollaborationRequestEmail(context, props) {
      return sendCollaborationRequestsEmail(context, props);
    },
  };
}
