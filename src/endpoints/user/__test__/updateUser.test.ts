import {SystemResourceType} from '../../../models/system';
import {ICollaborationRequest} from '../../../mongo/collaboration-request/definitions';
import {getNewId02} from '../../../utilities/ids';
import RequestData from '../../RequestData';
import {getTestBaseContext} from '../../testUtils/contexts/TestBaseContext';
import {chance} from '../../testUtils/data/data';
import {setupTestExpressRequestWithToken} from '../../testUtils/setups/setupTestExpressRequest';
import {setupTestUser} from '../../testUtils/setups/setupTestUser';
import {assertResultOk} from '../../testUtils/utils';
import {IUpdateUserParameters} from '../updateUser/types';
import updateUser from '../updateUser/updateUser';

function getTestRequests(userEmail: string, count = 5) {
  return Array(count)
    .fill(0)
    .map((): ICollaborationRequest => {
      const seed = chance.guid();
      const userId = getNewId02(SystemResourceType.User);
      const workspaceId = getNewId02(SystemResourceType.Workspace);
      return {
        workspaceId,
        customId: getNewId02(SystemResourceType.CollaborationRequest),
        createdAt: new Date(),
        from: {
          userId,
          workspaceId: getNewId02(SystemResourceType.Workspace),
          workspaceName: `test-block-name-${seed}`,
          userName: `test-name-${seed}`,
        },
        sentEmailHistory: [],
        statusHistory: [],
        to: {email: userEmail},
        title: `test-title-${seed}`,
        visibility: 'organization',
        createdBy: userId,
      };
    });
}

describe('updateUser', () => {
  test('collaboration requests moved on email update', async () => {
    const context = getTestBaseContext();
    const {token, user} = await setupTestUser(context);
    const {req} = setupTestExpressRequestWithToken({token});
    const testRequests = getTestRequests(user.email);
    await context.collaborationRequest.bulkSaveCollaborationRequests(context, testRequests);
    const input: IUpdateUserParameters = {
      data: {
        email: chance.email(),
      },
    };

    const reqData = RequestData.fromExpressRequest(context, req, input);
    const result = await updateUser(context, reqData);
    assertResultOk(result);
    const oldEmailRequests = await context.collaborationRequest.getUserCollaborationRequests(
      context,
      user.email
    );

    const newEmailRequests = await context.collaborationRequest.getUserCollaborationRequests(
      context,
      input.data.email!
    );

    expect(oldEmailRequests).toHaveLength(0);
    expect(newEmailRequests).toHaveLength(testRequests.length);
    await context.close();
  });
});
