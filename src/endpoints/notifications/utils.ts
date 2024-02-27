import {INotificationSubscription} from '../../mongo/notification/definitions';
import {getDateString} from '../../utilities/fns';
import {extractFields, getFields, publicResourceFields} from '../utils';
import {IPublicNotificationSubscription} from './types';

const publicNotificationSubscriptionFields = getFields<IPublicNotificationSubscription>({
  ...publicResourceFields,
  recipients: {
    userId: true,
    reason: true,
    addedBy: true,
    addedAt: getDateString,
  },
  resourceType: true,
  resourceId: true,
  notificationTypes: true,
  workspaceId: true,
});

export function getPublicNotificationSubscriptionData(
  subscription: Partial<INotificationSubscription>
): IPublicNotificationSubscription {
  return extractFields(subscription, publicNotificationSubscriptionFields);
}

export function getPublicNotificationSubscriptionsArray(
  subscriptions: Array<Partial<INotificationSubscription>>
): IPublicNotificationSubscription[] {
  return subscriptions.map(subscription =>
    extractFields(subscription, publicNotificationSubscriptionFields)
  );
}
