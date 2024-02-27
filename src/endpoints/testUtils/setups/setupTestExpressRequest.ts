import * as moment from 'moment';
import {IToken} from '../../../mongo/token/definitions';
import {cast} from '../../../utilities/fns';
import {clientConstants} from '../../clients/constants';
import {IServerRequest} from '../../contexts/types';

export interface ISetupTestExpressRequestWithTokenParams {
  token: IToken;
}

export interface ISetupTestExpressRequestWithTokenResult {
  req: IServerRequest;
}

export function setupTestExpressRequestWithToken(
  props: ISetupTestExpressRequestWithTokenParams
): ISetupTestExpressRequestWithTokenResult {
  const req = cast<IServerRequest>({
    ip: 'test::ip',
    ips: ['test::ip'],
    headers: {
      'user-agent': 'test-bot',
      [clientConstants.clientIdHeaderKey]: props.token.clientId,
    },
    user: {
      version: props.token.version,
      sub: {id: props.token.customId},
      iat: moment(props.token.createdAt).valueOf() / 1000,
    },
  });

  return {req};
}

export interface ISetupTestExpressRequestResult {
  req: IServerRequest;
}

export function setupTestExpressRequest(
  props: {token?: IToken; clientId?: string} = {}
): ISetupTestExpressRequestResult {
  const req = cast<IServerRequest>({
    ip: 'test::ip',
    ips: ['test::ip'],
    headers: {
      'user-agent': 'test-bot',
      [clientConstants.clientIdHeaderKey]: props.token?.clientId ?? props.clientId,
    },
    user: props.token
      ? {
          version: props.token.version,
          sub: {id: props.token.customId},
          iat: moment(props.token.createdAt).valueOf() / 1000,
        }
      : undefined,
  });

  return {req};
}
