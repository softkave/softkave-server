import assert = require('assert');
import RequestData from '../../RequestData';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {setupTestClient} from '../../testUtils/setups/setupTestClient';
import {setupTestExpressRequest} from '../../testUtils/setups/setupTestExpressRequest';
import {assertResultOk} from '../../testUtils/utils';
import newAnonymousUser from '../newAnonymousUser/handler';
import {assertUser, getUser} from '../utils';

const context = getTestBaseContext();

afterAll(async () => {
  await context.close();
});

describe('newAnonymousUser', () => {
  test('creates anonymous user', async () => {
    const {req} = setupTestExpressRequest();
    const reqData = RequestData.fromExpressRequest(context, req, undefined);
    const result = await newAnonymousUser(context, reqData);
    assertResultOk(result);
    assert(result);
    expect(result.token).toBeTruthy();
    expect(result.client).toBeTruthy();

    //  check token created
    const decodedToken = context.token.decodeToken(context, result.token);
    const tokenData = await context.token.getTokenById(context, decodedToken.sub.id);
    expect(tokenData).toBeTruthy();

    // check client created
    const client = await context.client.getClientById(context, result.client.customId);
    expect(client).toBeTruthy();

    // check user created
    const user = await getUser(context, result.user.customId);
    assertUser(user);
  });

  test('reuses existing client', async () => {
    const {client} = await setupTestClient(context);
    const {req} = setupTestExpressRequest({clientId: client.customId});
    const reqData = RequestData.fromExpressRequest(context, req, undefined);
    const result = await newAnonymousUser(context, reqData);
    assert(result);
    expect(result.client).toBeTruthy();
    expect(result.client?.customId).toEqual(client.customId);
  });
});
