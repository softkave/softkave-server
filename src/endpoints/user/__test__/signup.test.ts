import {faker} from '@faker-js/faker';
import RequestData from '../../RequestData';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {testData} from '../../testUtils/data/data';
import {setupTestClient} from '../../testUtils/setups/setupTestClient';
import {setupTestExpressRequest} from '../../testUtils/setups/setupTestExpressRequest';
import {EmailAddressNotAvailableError} from '../errors';
import signup from '../signup/signup';
import {ISignupArgData} from '../signup/types';
import {assertUser} from '../utils';
import assert = require('assert');

/**
 * TODO:
 * - tests that a user can signup
 * - tests that signup fails if a user with the same email address exists
 * - tests that the api reuses an existing client
 */

const context = getTestBaseContext();

afterAll(async () => {
  await context.close();
});

describe('signup', () => {
  test('can signup', async () => {
    const {req} = setupTestExpressRequest();
    const input: ISignupArgData = {
      user: {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        email: faker.internet.email(),
        password: testData.testUser00.password,
        color: testData.testUser00.color,
      },
    };

    const reqData = RequestData.fromExpressRequest(context, req, input);
    const result = await signup(context, reqData);
    expect(result).toBeTruthy();
    assert(result);
    expect(result.errors).toBeFalsy();
    expect(result.token).toBeTruthy();
    expect(result.client).toBeTruthy();
    expect(result.user).toMatchObject({
      firstName: input.user.firstName,
      lastName: input.user.lastName,
      email: input.user.email.toLowerCase(),
      color: input.user.color,
    });

    const decodedToken = context.token.decodeToken(context, result.token);
    const tokenData = await context.token.getTokenById(context, decodedToken.sub.id);
    expect(tokenData).toBeTruthy();
    const client = await context.client.getClientById(context, result.client.customId);
    expect(client).toBeTruthy();
    const user = await context.user.getUserById(context, result.user.customId);
    assertUser(user);
  });

  test('returns error if user exists', async () => {
    const {req} = setupTestExpressRequest();
    const input01: ISignupArgData = {
      user: {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        email: faker.internet.email(),
        password: testData.testUser00.password,
        color: testData.testUser00.color,
      },
    };

    await signup(context, RequestData.fromExpressRequest(context, req, input01));
    try {
      await signup(context, RequestData.fromExpressRequest(context, req, input01));
      throw new Error('should fail but passed');
    } catch (error: any) {
      expect(error.name).toEqual(EmailAddressNotAvailableError.name);
    }
  });

  test('reuses existing clients', async () => {
    const {client} = await setupTestClient(context);
    const {req} = setupTestExpressRequest({clientId: client.customId});
    const input: ISignupArgData = {
      user: {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        email: faker.internet.email(),
        password: testData.testUser00.password,
        color: testData.testUser00.color,
      },
    };

    const reqData = RequestData.fromExpressRequest(context, req, input);
    const result = await signup(context, reqData);
    assert(result);
    expect(result.client).toBeTruthy();
    expect(result.client?.customId).toEqual(client.customId);
  });
});
