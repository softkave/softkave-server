import {validate} from '../../../utilities/joiUtils';
import {getPublicNotificationSubscriptionsArray} from '../utils';
import {GetResourceSubscriptionsEndpoint} from './types';
import {getResourceSubscriptionsJoiSchema} from './validation';

const getResourceSubscriptions: GetResourceSubscriptionsEndpoint = async (ctx, d) => {
  const data = validate(d.data, getResourceSubscriptionsJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  const subscriptions = await ctx.notification.getNotificationSubscriptionsByResourceId(
    ctx,
    data.blockId
  );

  return {
    subscriptions: getPublicNotificationSubscriptionsArray(subscriptions),
  };
};

export default getResourceSubscriptions;
