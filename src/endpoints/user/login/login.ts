import * as argon2 from 'argon2';
import {ClientType, SystemResourceType} from '../../../models/system';
import {ServerError} from '../../../utilities/errors';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {assertUpdateClient, clientToClientUserView} from '../../clients/utils';
import {CURRENT_USER_TOKEN_VERSION} from '../../contexts/TokenContext';
import {JWTTokenScope} from '../../types';
import {fireAndForgetPromise} from '../../utils';
import {InvalidEmailOrPasswordError} from '../errors';
import {getPublicUserData} from '../utils';
import {LoginEndpoint} from './types';
import {loginJoiSchema} from './validation';

const login: LoginEndpoint = async (ctx, d) => {
  const loginDetails = validate(d.data, loginJoiSchema);
  const user = await ctx.user.getUserByEmail(ctx, loginDetails.email);
  if (!user) {
    throw new InvalidEmailOrPasswordError();
  }

  let passwordMatch = false;
  try {
    passwordMatch = await argon2.verify(user.hash, loginDetails.password);
  } catch (error) {
    console.error(error);
    throw new ServerError();
  }

  if (!passwordMatch) {
    throw new InvalidEmailOrPasswordError();
  }

  let client = await ctx.session.tryGetClient(ctx, d);
  if (!client) {
    client = await ctx.client.saveClient(ctx, {
      customId: getNewId02(SystemResourceType.Client),
      createdAt: getDateString(),
      clientType: ClientType.Browser,
      users: [],
    });
  }

  d.client = client;
  const tokenData =
    (await ctx.token.getTokenByUserAndClientId(ctx, user.customId, client.customId)) ||
    (await ctx.token.saveToken(ctx, {
      clientId: client.customId,
      customId: getNewId02(SystemResourceType.UserToken),
      audience: [JWTTokenScope.Login],
      createdAt: getDateString(),
      userId: user.customId,
      version: CURRENT_USER_TOKEN_VERSION,
    }));

  d.tokenData = tokenData;
  client = await assertUpdateClient(ctx, client.customId, user.customId, tokenData.customId, {
    userId: user.customId,
    tokenId: tokenData.customId,
    isLoggedIn: true,
  });

  d.client = client;
  const token = ctx.token.encodeToken(ctx, tokenData.customId);
  fireAndForgetPromise(ctx.unseenChats.removeEntry(ctx, user.customId));
  return {
    token,
    user: getPublicUserData(user),
    client: clientToClientUserView(d.client, user.customId),
  };
};

export default login;
