import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import boardExists from "../boardExists/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(boardExists, context);

describe("board exists", () => {
  test("board exists if it does", async () => {
    const { token } = await setupTestUser(context);
    const { req } = setupTestExpressRequestWithToken({ token });
    const boardName = chance.company();
    const { organization } = await setupTestOrganizationWithEndpoint(
      context,
      req
    );

    await setupTestBoardWithEndpoint(context, req, organization.customId, {
      name: boardName,
    });

    const result = await endpoint(
      { name: boardName, parent: organization.customId },
      req
    );

    assertResultOk(result);
    expect(result?.exists).toBeTruthy();
  });

  test("board does not exist if it does not", async () => {
    const { token } = await setupTestUser(context);
    const { req } = setupTestExpressRequestWithToken({ token });
    const { organization } = await setupTestOrganizationWithEndpoint(
      context,
      req
    );

    const result = await endpoint(
      { name: chance.company(), parent: organization.customId },
      req
    );

    assertResultOk(result);
    expect(result?.exists).toBeFalsy();
  });
});
