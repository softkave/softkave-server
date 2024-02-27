import {ClientType, SystemResourceType} from '../../../models/system';
import {IUser} from '../../../mongo/user/definitions';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {assertUpdateClient, clientToClientUserView} from '../../clients/utils';
import {CURRENT_USER_TOKEN_VERSION} from '../../contexts/TokenContext';
import {JWTTokenScope} from '../../types';
import {userConstants} from '../constants';
import {getPublicUserData} from '../utils';
import {NewAnonymousUserEndpoint} from './types';
import randomColor = require('randomcolor');

const newAnonymousUser: NewAnonymousUserEndpoint = async (ctx, d) => {
  const userId = getNewId02(SystemResourceType.AnonymousUser);
  const user: IUser = {
    customId: userId,
    email: userConstants.newAnonymousUserEmail(userId),
    firstName: 'Anonymous',
    lastName: 'User',
    color: randomColor(),
    createdAt: getDateString(),
    hash: '',
    workspaces: [],
    isAnonymousUser: true,
  };

  await ctx.data.anonymousUser.insertList(ctx, [user]);
  let client =
    (await ctx.session.tryGetClient(ctx, d)) ||
    (await ctx.client.saveClient(ctx, {
      customId: getNewId02(SystemResourceType.Client),
      createdAt: getDateString(),
      clientType: ClientType.Browser,
      users: [],
    }));

  const tokenData = await ctx.token.saveToken(ctx, {
    clientId: client.customId,
    customId: getNewId02(SystemResourceType.UserToken),
    audience: [JWTTokenScope.Login],
    createdAt: getDateString(),
    userId: user.customId,
    version: CURRENT_USER_TOKEN_VERSION,
  });

  client = await assertUpdateClient(ctx, client.customId, user.customId, tokenData.customId, {
    userId: user.customId,
    tokenId: tokenData.customId,
    isLoggedIn: true,
  });

  const token = ctx.token.encodeToken(ctx, tokenData.customId);
  return {
    token,
    user: getPublicUserData(user),
    client: clientToClientUserView(client, user.customId),
  };
};

export default newAnonymousUser;
