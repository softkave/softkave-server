import {validate} from '../../../utilities/joiUtils';
import {subcribeValidationSchema} from '../subscribe/validation';
import {PushSubscriptionExistsEndpoint} from './types';

const pushSubscriptionExists: PushSubscriptionExistsEndpoint = async (context, instData) => {
  const data = validate(instData.data, subcribeValidationSchema);
  const client = await context.client.getClientByPushSubscription(
    context,
    data.endpoint,
    data.keys
  );

  return {
    exists: !!client,
  };
};

export default pushSubscriptionExists;
