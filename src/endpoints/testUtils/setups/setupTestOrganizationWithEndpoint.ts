import {faker} from '@faker-js/faker';
import * as assert from 'assert';
import {IBaseContext} from '../../contexts/IBaseContext';
import {IServerRequest} from '../../contexts/types';
import createOrganization from '../../organizations/createOrganization/handler';
import {ICreateOrganizationParameters} from '../../organizations/createOrganization/types';
import {INewOrganizationInput} from '../../organizations/types';
import RequestData from '../../RequestData';
import {chance} from '../data/data';
import {assertResultOk} from '../utils';
import {setupTestExpressRequestWithToken} from './setupTestExpressRequest';
import {setupTestUser} from './setupTestUser';

export async function setupTestOrganizationWithEndpoint(
  context: IBaseContext,
  req: IServerRequest,
  base: Partial<INewOrganizationInput> = {}
) {
  const result = await createOrganization(
    context,
    RequestData.fromExpressRequest<ICreateOrganizationParameters>(context, req, {
      organization: {
        name: faker.company.name(),
        description: chance.sentence({words: 10}),
        color: chance.color({format: 'hex'}),
        ...base,
      },
    })
  );

  assertResultOk(result);
  assert(result);
  assert.ok(result.organization);
  return {
    organization: result.organization,
  };
}

/**
 * Sets up a test user and user artifacts, express request, and organization.
 * @param ctx
 * @param bases
 * @returns
 */
export async function setupTestOrganizationWithEndpoint02(
  ctx: IBaseContext,
  bases?: {
    org: Partial<INewOrganizationInput>;
  }
) {
  const setupUserResult = await setupTestUser(ctx);
  const setupRequestResult = setupTestExpressRequestWithToken({token: setupUserResult.token});
  const setupOrgResult = await setupTestOrganizationWithEndpoint(
    ctx,
    setupRequestResult.req,
    bases?.org
  );
  return {...setupUserResult, ...setupRequestResult, ...setupOrgResult};
}
