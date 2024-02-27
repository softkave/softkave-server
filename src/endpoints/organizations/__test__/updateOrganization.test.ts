import assert = require('assert');
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {wrapEndpointREST} from '../../wrapEndpointREST';
import updateOrganization from '../updateOrganization/handler';
import {IUpdateOrganizationInput} from '../updateOrganization/types';

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(updateOrganization, context);

afterAll(async () => {
  await context.close();
});

describe('update organization', () => {
  test('can update organization', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const input: IUpdateOrganizationInput = {
      name: chance.company(),
      description: chance.sentence({words: 12}),
      color: chance.color({format: 'hex'}),
    };

    const {organization: org01} = await setupTestOrganizationWithEndpoint(context, req, input);
    const result = await endpoint({organizationId: org01.customId, data: input}, req);
    assertResultOk(result);
    assert(result);
    expect(result?.organization).toMatchObject(input);
    const organization = await context.data.workspace.getOneByQuery(context, {
      customId: result.organization.customId,
    });
    expect(organization).toMatchObject(input);
  });
});
