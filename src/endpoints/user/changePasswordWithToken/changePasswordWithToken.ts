import {ClientType, SystemResourceType} from '../../../models/system';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {JWTTokenScope} from '../../types';
import changePassword from '../changePassword/changePassword';
import {CredentialsExpiredError, InvalidCredentialsError} from '../errors';
import {ChangePasswordWithTokenEndpoint} from './types';

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (context, instData) => {
  const tokenData = await context.session.getTokenData(
    context,
    instData,
    JWTTokenScope.ChangePassword
  );

  if (!context.token.containsAudience(context, tokenData, JWTTokenScope.ChangePassword)) {
    throw new InvalidCredentialsError();
  }

  const incomingTokenData = instData.incomingTokenData;
  if (incomingTokenData && Date.now() > incomingTokenData.exp * 1000) {
    throw new CredentialsExpiredError();
  }

  const user = await context.user.assertGetUserById(context, tokenData.userId);
  instData.user = user;
  let client = await context.session.tryGetClient(context, instData);
  if (!client) {
    client = await context.client.saveClient(context, {
      customId: getNewId02(SystemResourceType.Client),
      createdAt: getDateString(),
      clientType: ClientType.Browser,
      users: [],
    });
  }

  instData.client = client;
  const result = await changePassword(context, instData);
  if (incomingTokenData) {
    // fireAndForgetPromise(context.token.deleteTokenById(context, incomingTokenData.sub.id));
  }

  return result;
};

export default changePasswordWithToken;
