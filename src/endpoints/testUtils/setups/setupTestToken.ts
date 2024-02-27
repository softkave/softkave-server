import * as moment from 'moment';
import {SystemResourceType} from '../../../models/system';
import {IClient} from '../../../mongo/client/definitions';
import {IToken} from '../../../mongo/token/definitions';
import {IUser} from '../../../mongo/user/definitions';
import {getDateString} from '../../../utilities/fns';
import {getNewId02} from '../../../utilities/ids';
import {IBaseContext} from '../../contexts/IBaseContext';
import {CURRENT_USER_TOKEN_VERSION, IBaseTokenData} from '../../contexts/TokenContext';
import {JWTTokenScope} from '../../types';

export interface ISetupTestTokenResult {
  token: IToken;
  incomingTokenData: IBaseTokenData;
  context: IBaseContext;
}

export interface ISetupTestTokenProps {
  client: IClient;
  user: IUser;
}

export async function setupTestToken(
  context: IBaseContext,
  props: ISetupTestTokenProps
): Promise<ISetupTestTokenResult> {
  let token: IToken = {
    customId: getNewId02(SystemResourceType.UserToken),
    userId: props.user.customId,
    version: CURRENT_USER_TOKEN_VERSION,
    createdAt: getDateString(),
    audience: [JWTTokenScope.Login],
    expires: 0,
    meta: {},
    clientId: props.client.customId,
  };

  token = await context.token.saveToken(context, token);
  const incomingTokenData: IBaseTokenData = {
    version: token.version,
    sub: {
      id: token.customId,
    },
    iat: moment(token.createdAt).valueOf() / 1000,
    exp: token.expires ? token.expires / 1000 : undefined,
  };

  await context.client.updateClientById(context, props.client.customId, {
    users: [
      {
        userId: props.user.customId,
        tokenId: token.customId,
        isLoggedIn: true,
      },
    ],
  });

  const result: ISetupTestTokenResult = {
    context,
    token,
    incomingTokenData,
  };

  return result;
}
