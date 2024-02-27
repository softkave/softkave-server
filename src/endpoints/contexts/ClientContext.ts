import assert = require('assert');
import {IClient, IClientUserEntry} from '../../mongo/client/definitions';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {ClientDoesNotExistError} from '../clients/errors';
import {findUserEntryInClient} from '../clients/utils';
import {IBaseContext} from './IBaseContext';

export interface IClientContext {
  saveClient: (ctx: IBaseContext, client: IClient) => Promise<IClient>;
  getClientById: (ctx: IBaseContext, customId: string) => Promise<IClient | null>;
  getPushSubscribedClients: (ctx: IBaseContext, userId: string) => Promise<IClient[]>;
  assertGetClientById: (ctx: IBaseContext, customId: string) => Promise<IClient>;
  updateUserEntry: (
    ctx: IBaseContext,
    customId: string,
    userId: string,
    tokenId: string,
    data: Partial<IClientUserEntry>
  ) => Promise<IClient | null>;
  updateClientById: (
    ctx: IBaseContext,
    customId: string,
    data: Partial<IClient>
  ) => Promise<IClient | null>;
  getClientByPushSubscription: (
    ctx: IBaseContext,
    endpoint: string,
    keys: IClient['keys']
  ) => Promise<IClient | null>;
}

export default class ClientContext implements IClientContext {
  getClientByPushSubscription = (ctx: IBaseContext, endpoint: string, keys: IClient['keys']) => {
    assert(keys);
    return ctx.models.client.model
      .findOne({
        endpoint,
        'keys.p256dh': keys.p256dh,
        'keys.auth': keys.auth,
      })
      .lean()
      .exec();
  };

  saveClient = async (ctx: IBaseContext, data: IClient) => {
    const client = new ctx.models.client.model(data);
    return client.save();
  };

  getClientById = (ctx: IBaseContext, customId: string) => {
    return ctx.models.client.model.findOne({customId}).lean().exec();
  };

  getPushSubscribedClients = (ctx: IBaseContext, userId: string) => {
    return ctx.models.client.model
      .find({
        users: {
          $elemMatch: {
            userId,
            muteChatNotifications: false,
            isLoggedIn: true,
          },
        },
        endpoint: {$ne: null},
        keys: {$ne: null},
      })
      .lean()
      .exec();
  };

  assertGetClientById = async (ctx: IBaseContext, customId: string) => {
    const client = await ctx.client.getClientById(ctx, customId);

    if (!client) {
      throw new ClientDoesNotExistError();
    }

    return client;
  };

  updateUserEntry = async (
    ctx: IBaseContext,
    customId: string,
    userId: string,
    tokenId: string,
    data: Partial<IClientUserEntry>
  ) => {
    // TODO: possible performance improvement here
    // should we get the client from the reqData
    let client = await ctx.models.client.model.findOne({customId}).lean().exec();

    if (!client) {
      throw new ClientDoesNotExistError();
    }

    let {index, entry} = findUserEntryInClient(client, userId) || {
      index: client.users.length,
      entry: {
        userId,
        tokenId,
      },
    };

    entry = {...entry, ...data};
    client = await ctx.models.client.model
      .findOneAndUpdate({customId: client.customId}, {[`users.${index}`]: entry}, {new: true})
      .lean()
      .exec();

    return client;
  };

  updateClientById = async (ctx: IBaseContext, customId: string, data: Partial<IClient>) => {
    return await ctx.models.client.model
      .findOneAndUpdate({customId}, data, {new: true})
      .lean()
      .exec();
  };
}

export const getClientContext = makeSingletonFn(() => new ClientContext());
