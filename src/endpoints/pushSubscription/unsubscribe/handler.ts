import {UnsubscribePushSubscriptionEndpoint} from './types';

const unsubscribePushSubscription: UnsubscribePushSubscriptionEndpoint = async (ctx, d) => {
  const client = await ctx.session.getClient(ctx, d);
  await ctx.client.updateClientById(ctx, client.customId, {
    endpoint: null,
    keys: null,
  });
};

export default unsubscribePushSubscription;
