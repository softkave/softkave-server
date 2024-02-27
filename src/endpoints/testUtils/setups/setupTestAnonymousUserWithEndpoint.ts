import * as assert from 'assert';
import {assertArg} from '../../../utilities/fns';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IServerRequest} from '../../contexts/types';
import RequestData from '../../RequestData';
import newAnonymousUser from '../../user/newAnonymousUser/handler';
import {assertUser} from '../../user/utils';
import {assertResultOk} from '../utils';
import {setupTestExpressRequest} from './setupTestExpressRequest';

export async function setupTestAnonymousUserWithEndpoint(
  context: IBaseContext,
  req: IServerRequest
) {
  const result = await newAnonymousUser(
    context,
    RequestData.fromExpressRequest(context, req, undefined)
  );

  assertResultOk(result);
  assert(result);
  const [anonymousUser, anonymousUserToken] = await Promise.all([
    context.data.anonymousUser.getOneByQuery(context, {customId: result.user.customId}),
    context.data.token.getOneByQuery(context, {userId: {$eq: result.user.customId}}),
    ,
  ]);
  assertUser(anonymousUser);
  assertArg(anonymousUserToken);
  return {
    ...result,
    anonymousUser,
    anonymousUserToken,
    anonymousUserReq: setupTestExpressRequest({token: anonymousUserToken}).req,
  };
}
