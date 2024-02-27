import * as argon2 from 'argon2';
import * as uuid from 'uuid';
import {ClientType, SystemResourceType} from '../../../models/system';
import {IUser} from '../../../mongo/user/definitions';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {validate} from '../../../utilities/joiUtils';
import {assertUpdateClient, clientToClientUserView} from '../../clients/utils';
import {CURRENT_USER_TOKEN_VERSION} from '../../contexts/TokenContext';
import {JWTTokenScope} from '../../types';
import {EmailAddressNotAvailableError} from '../errors';
import {getPublicUserData} from '../utils';
import {SignupEndpoint} from './types';
import {newUserInputSchema} from './validation';

const signup: SignupEndpoint = async (ctx, reqData) => {
  const data = validate(reqData.data?.user, newUserInputSchema);
  const userExists = await ctx.user.userExists(ctx, data.email);
  if (userExists) {
    throw new EmailAddressNotAvailableError({field: 'email'});
  }

  const hash = await argon2.hash(data.password);
  const now = getDateString();
  const value: IUser = {
    hash,
    customId: uuid.v4(),
    email: data.email.toLowerCase(),
    firstName: data.firstName,
    lastName: data.lastName,
    color: data.color,
    createdAt: now,
    forgotPasswordHistory: [],
    passwordLastChangedAt: now,
    workspaces: [],
  };

  let user = await ctx.user.saveUser(ctx, value);
  reqData.user = user;
  let client =
    (await ctx.session.tryGetClient(ctx, reqData)) ||
    (await ctx.client.saveClient(ctx, {
      customId: getNewId02(SystemResourceType.Client),
      createdAt: getDateString(),
      clientType: ClientType.Browser,
      users: [],
    }));

  reqData.client = client;
  const tokenData = await ctx.token.saveToken(ctx, {
    clientId: client.customId,
    customId: getNewId02(SystemResourceType.UserToken),
    audience: [JWTTokenScope.Login],
    createdAt: getDateString(),
    userId: user.customId,
    version: CURRENT_USER_TOKEN_VERSION,
  });

  reqData.tokenData = tokenData;
  client = await assertUpdateClient(ctx, client.customId, user.customId, tokenData.customId, {
    userId: user.customId,
    tokenId: tokenData.customId,
    isLoggedIn: true,
  });

  reqData.client = client;
  const token = ctx.token.encodeToken(ctx, tokenData.customId);
  return {
    token,
    user: getPublicUserData(user),
    client: clientToClientUserView(reqData.client, user.customId),
  };
};

export default signup;
