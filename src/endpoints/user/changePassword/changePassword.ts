import * as argon2 from 'argon2';
import {SystemResourceType} from '../../../models/system';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {assertUpdateClient, clientToClientUserView} from '../../clients/utils';
import {CURRENT_USER_TOKEN_VERSION} from '../../contexts/TokenContext';
import {JWTTokenScope} from '../../types';
import {assertUpdateUser, getPublicUserData} from '../utils';
import {ChangePasswordEndpoint} from './types';
import {changePasswordJoiSchema} from './validation';

const changePassword: ChangePasswordEndpoint = async (ctx, d) => {
  const result = validate(d.data, changePasswordJoiSchema);
  const newPassword = result.password;
  let user = await ctx.session.getUser(ctx, d);
  let client = await ctx.session.getClient(ctx, d);
  const hash = await argon2.hash(newPassword);
  user = await assertUpdateUser(ctx, user.customId, {
    hash,
    passwordLastChangedAt: getDateString(),
  });

  d.user = user;
  delete d.tokenData;
  delete d.incomingTokenData;
  // fireAndForgetPromise(ctx.token.deleteTokensByUserId(ctx, user.customId));
  const tokenData = await ctx.token.saveToken(ctx, {
    clientId: client.customId,
    customId: getNewId02(SystemResourceType.UserToken),
    audience: [JWTTokenScope.Login],
    createdAt: getDateString(),
    userId: user.customId,
    version: CURRENT_USER_TOKEN_VERSION,
  });

  d.tokenData = tokenData;
  client = await assertUpdateClient(ctx, client.customId, user.customId, tokenData.customId, {
    userId: user.customId,
    tokenId: tokenData.customId,
    isLoggedIn: true,
  });

  d.client = client;
  const token = ctx.token.encodeToken(ctx, tokenData.customId);
  return {
    token,
    client: clientToClientUserView(d.client, user.customId),
    user: getPublicUserData(user),
  };
};

export default changePassword;
