import {ClientType, SystemResourceType} from '../../../models/system';
import {IClient} from '../../../mongo/client/definitions';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {IBaseContext} from '../../contexts/IBaseContext';

export interface ISetupTestClientResult {
  client: IClient;
  context: IBaseContext;
}

export async function setupTestClient(context: IBaseContext): Promise<ISetupTestClientResult> {
  let client: IClient = {
    customId: getNewId02(SystemResourceType.Client),
    createdAt: getDateString(),
    clientType: ClientType.Browser,
    users: [],
    endpoint: '',
    keys: {
      p256dh: '',
      auth: '',
    },
    pushSubscribedAt: '',
  };

  client = await context.client.saveClient(context, client);
  const result: ISetupTestClientResult = {
    context,
    client,
  };

  return result;
}
