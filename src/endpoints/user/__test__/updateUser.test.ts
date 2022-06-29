import { BlockType } from "../../../mongo/block";
import RequestData from "../../RequestData";
import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { assertResultOk } from "../../testUtils/utils";
import { IUpdateUserParameters } from "../updateUser/types";
import updateUser from "../updateUser/updateUser";

function getTestRequests(userEmail: string, count = 5) {
  return Array(count)
    .fill(0)
    .map(() => {
      const seed = chance.guid();
      return {
        customId: seed,
        createdAt: new Date(),
        from: {
          blockId: `test-block-id-${seed}`,
          blockType: BlockType.Organization,
          blockName: `test-block-name-${seed}`,
          name: `test-name-${seed}`,
          userId: `test-user-id-${seed}`,
        },
        sentEmailHistory: [],
        statusHistory: [],
        to: {
          email: userEmail,
        },
        title: `test-title-${seed}`,
      };
    });
}

describe("updateUser", () => {
  test("collaboration requests moved on email update", async () => {
    const context = getTestBaseContext();
    const { token, user } = await setupTestUser(context);
    const { req } = setupTestExpressRequestWithToken({ token });
    const testRequests = getTestRequests(user.email);
    await context.collaborationRequest.bulkSaveCollaborationRequests(
      context,
      testRequests
    );

    const input: IUpdateUserParameters = {
      data: {
        email: chance.email(),
      },
    };

    const reqData = RequestData.fromExpressRequest(context, req, input);
    const result = await updateUser(context, reqData);
    assertResultOk(result);
    const oldEmailRequests =
      await context.collaborationRequest.getUserCollaborationRequests(
        context,
        user.email
      );

    const newEmailRequests =
      await context.collaborationRequest.getUserCollaborationRequests(
        context,
        input.data.email
      );

    expect(oldEmailRequests).toHaveLength(0);
    expect(newEmailRequests).toHaveLength(testRequests.length);
  });
});
