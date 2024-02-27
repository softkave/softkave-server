import {GetPushSubscriptionKeysEndpoint} from './types';

const getPushSubscriptionKeys: GetPushSubscriptionKeysEndpoint = async context => {
  return {
    vapidPublicKey: context.appVariables.vapidPublicKey,
  };
};

export default getPushSubscriptionKeys;
