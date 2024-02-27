import {RequestOptions, SendResult} from 'web-push';
import {IClientPushNotificationKeys} from '../../../mongo/client/definitions';
import makeSingletonFn from '../../../utilities/createSingletonFunc';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IWebPushContext} from '../../contexts/WebPushContext';

export interface ITestWebPushContextListener {
  endpoint: string;
  keys: IClientPushNotificationKeys;
  cb: (message?: string | Buffer | null) => void;
}

export interface ITestWebPushContext extends IWebPushContext {
  addListener: (
    endpoint: string,
    keys: IClientPushNotificationKeys,
    cb: ITestWebPushContextListener['cb']
  ) => void;
  removeListener: (endpoint: string, keys: IClientPushNotificationKeys) => void;
}

const listeners: ITestWebPushContextListener[] = [];
function findListenerIndex(endpoint: string, keys: IClientPushNotificationKeys) {
  return listeners.findIndex(
    entry =>
      entry.endpoint === endpoint &&
      entry.keys.auth === keys.auth &&
      entry.keys.p256dh === keys.p256dh
  );
}

function findListener(endpoint: string, keys: IClientPushNotificationKeys) {
  const i = findListenerIndex(endpoint, keys);
  return i !== -1 ? listeners[i] : undefined;
}

function deleteListener(endpoint: string, keys: IClientPushNotificationKeys) {
  const index = findListenerIndex(endpoint, keys);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
}

// completely random, not sure if correct
const defaultSendResult: SendResult = {
  body: '',
  headers: {},
  statusCode: 1,
};

export class TestWebPushContext implements ITestWebPushContext {
  sendNotification = async (
    ctx: IBaseContext,
    endpoint: string,
    keys: IClientPushNotificationKeys,
    message?: string | Buffer | null,
    options?: RequestOptions
  ) => {
    const listener = findListener(endpoint, keys);
    if (listener) {
      listener.cb(message);
    }
    return defaultSendResult;
  };

  addListener(
    endpoint: string,
    keys: IClientPushNotificationKeys,
    cb: ITestWebPushContextListener['cb']
  ) {
    if (!findListener(endpoint, keys)) {
      listeners.push({endpoint, keys, cb});
    }
  }

  removeListener(endpoint: string, keys: IClientPushNotificationKeys) {
    deleteListener(endpoint, keys);
  }
}

export const getTestWebPushContext = makeSingletonFn(() => new TestWebPushContext());
