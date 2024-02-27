import {IClient, IClientUserEntry, IClientUserView} from '../../mongo/client/definitions';
import {IBaseContext} from '../contexts/IBaseContext';
import {ClientDoesNotExistError} from './errors';
import {IPublicClient} from './types';

export function clientToClientUserView(client: IClient, userId: string) {
  const findResult = findUserEntryInClient(client, userId);
  if (!findResult) {
    throw new Error('Client is not attached to user');
  }

  const view: IClientUserView = {
    customId: client.customId,
    createdAt: client.createdAt,
    clientType: client.clientType,
    isSubcribedToPushNotifications: !!(client.endpoint && client.keys),
    ...findResult.entry,
  };

  return view;
}

export const getPublicClientData = clientToClientUserView;

export function getPublicClientArray(clients: IClient[], userId: string): IPublicClient[] {
  return clients.map(client => clientToClientUserView(client, userId));
}

export function findUserEntryInClient(client: IClient, userId: string) {
  const index = client.users.findIndex(data => data.userId === userId);
  if (index === -1) {
    return null;
  } else {
    return {index, entry: client.users[index]};
  }
}

export function assertClient(u?: IClient | null): asserts u {
  if (!u) {
    throw new ClientDoesNotExistError();
  }
}

export async function assertUpdateClient(
  ctx: IBaseContext,
  id: string,
  userId: string,
  tokenId: string,
  data: Partial<IClientUserEntry>
) {
  const client = await ctx.client.updateUserEntry(ctx, id, userId, tokenId, data);
  assertClient(client);
  return client;
}
