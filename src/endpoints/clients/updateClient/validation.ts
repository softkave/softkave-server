import * as Joi from 'joi';

export const updateClientJoiSchema = Joi.object()
  .keys({
    data: Joi.object()
      .keys({
        hasUserSeenNotificationsPermissionDialog: Joi.bool(),
        muteChatNotifications: Joi.bool(),
        isLoggedIn: Joi.bool(),
      })
      .required(),
  })
  .required();
