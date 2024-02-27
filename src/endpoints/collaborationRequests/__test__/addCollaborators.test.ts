import {containsEveryItemIn} from '../../testUtils/assertion/list';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestCollaborationRequestWithEndpoint} from '../../testUtils/setups/setupTestCollaborationRequestWithEndpoint';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestOrganizationWithEndpoint} from '../../testUtils/setups/setupTestOrganizationWithEndpoint';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {INewCollaboratorInput} from '../addCollaborators/types';

const context = getTestBaseContext();

afterAll(async () => {
  await context.close();
});

describe('add collaborators', () => {
  test('can add collaborators', async () => {
    const {token} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const {organization} = await setupTestOrganizationWithEndpoint(context, req);
    const input: INewCollaboratorInput[] = [{email: chance.email()}, {email: chance.email()}];
    const result = await setupTestCollaborationRequestWithEndpoint(
      context,
      req,
      organization.customId,
      input
    );

    expect(result?.requests).toHaveLength(2);
    containsEveryItemIn(
      result.requests,
      input.map(item => ({to: {email: item.email}})),
      item => item.to.email
    );
    const requests = await context.collaborationRequest.getCollaborationRequestsByBlockId(
      context,
      organization.customId
    );
    containsEveryItemIn(
      requests,
      input.map(item => ({to: {email: item.email}})),
      item => item.to.email
    );
  });
});
