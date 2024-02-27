import assert = require('assert');
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {INewOrganizationInput} from '../types';

const context = getTestBaseContext();

afterAll(async () => {
  await context.close();
});

describe('create organization', () => {
  test('can create organization', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const input: INewOrganizationInput = {
      name: chance.company(),
      description: chance.sentence({words: 30}),
      color: chance.color({format: 'hex'}),
    };

    const result = await setupTestOrganizationWithEndpoint(context, req, input);
    expect(result?.organization).toMatchObject(input);
    const organization = await context.data.workspace.getOneByQuery(context, {
      customId: result.organization.customId,
    });
    expect(organization).toBeTruthy();
    assert(organization);
    expect(result?.organization.customId).toEqual(organization.customId);
  });
});
