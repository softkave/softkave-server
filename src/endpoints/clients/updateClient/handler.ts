import {validate} from '../../../utilities/joiUtils';
import {fireAndForgetPromise} from '../../utils';
import {assertUpdateClient, clientToClientUserView} from '../utils';
import {UpdateClientEndpoint} from './types';
import {updateClientJoiSchema} from './validation';

const updateClient: UpdateClientEndpoint = async (ctx, d) => {
  const data = validate(d.data, updateClientJoiSchema);
  const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
  let client = await ctx.session.getClient(ctx, d);
  const token = await ctx.session.getTokenData(ctx, d);
  client = await assertUpdateClient(ctx, client.customId, user.customId, token.customId, data.data);

  if (data.data.isLoggedIn) {
    fireAndForgetPromise(ctx.unseenChats.removeEntry(ctx, user.customId));
  }

  return {client: clientToClientUserView(client, user.customId)};
};

export default updateClient;
