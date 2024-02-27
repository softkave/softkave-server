import * as Joi from 'joi';
import {ISubscribePushSubscriptionParameters} from './types';

export const subcribeValidationSchema = Joi.object<ISubscribePushSubscriptionParameters>({
  endpoint: Joi.string().max(3000).required(),
  keys: Joi.object<ISubscribePushSubscriptionParameters['keys']>({
    auth: Joi.string().max(3000).required(),
    p256dh: Joi.string().max(3000).required(),
  }).required(),
}).required();
