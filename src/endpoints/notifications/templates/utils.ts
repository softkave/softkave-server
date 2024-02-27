import {INotification} from '../../../mongo/notification/definitions';

export interface IBaseNotificationTemplateProps {
  base: Pick<INotification, 'recipientEmail' | 'recipientId' | 'workspaceId' | 'subscriptionId'>;
}

export function bodyDeltaToText(bodyDelta: any[]) {
  return bodyDelta
    .map(part => {
      if (part.insert) {
        return part.insert;
      }
      return '';
    })
    .join('');
}
