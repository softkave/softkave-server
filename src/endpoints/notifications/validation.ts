import * as Joi from 'joi';
import {
  NotificationSubscriptionReason,
  NotificationType,
} from '../../mongo/notification/definitions';
import {notificationConstants} from './constants';

const subscriptionResourceType = Joi.string().valid(
  ...notificationConstants.subscriptionResourceTypes
);

const reasonsArr: NotificationSubscriptionReason[] = [
  NotificationSubscriptionReason.AddedByUser,
  NotificationSubscriptionReason.UserCreatedResource,
  NotificationSubscriptionReason.WasAssignedTask,
];

const notificationReason = Joi.string().valid(...reasonsArr);

const typeArr: NotificationType[] = [
  NotificationType.CollaborationRequestResponse,
  NotificationType.CollaborationRequestUpdated,
  NotificationType.CollaborationRequestRevoked,

  NotificationType.TaskAssigned,
  NotificationType.TaskUnassigned,
];

const notificationType = Joi.string().valid(...typeArr);

const notificationsValidationSchemas = {
  notificationReason,
  subscriptionResourceType,
  notificationType,
};

export default notificationsValidationSchemas;
