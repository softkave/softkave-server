import {getDateString} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {PushSubscriptionExistsError} from '../errors';
import {SubscribePushSubscriptionEndpoint} from './types';
import {subcribeValidationSchema} from './validation';

const subscribePushSubscription: SubscribePushSubscriptionEndpoint = async (ctx, d) => {
  const data = validate(d.data, subcribeValidationSchema);
  const client = await ctx.session.getClient(ctx, d);
  const existingSubscription = await ctx.client.getClientByPushSubscription(
    ctx,
    data.endpoint,
    data.keys
  );

  if (existingSubscription) {
    throw new PushSubscriptionExistsError();
  }

  await ctx.client.updateClientById(ctx, client.customId, {
    endpoint: data.endpoint,
    keys: data.keys,
    pushSubscribedAt: getDateString(),
  });
};

export default subscribePushSubscription;
