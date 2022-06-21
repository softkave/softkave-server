import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import getOrganizationBoards from "../getOrganizationBoards/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getOrganizationBoards, context);

describe("get organization boards", () => {
    test("can get boards", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const { organization: org01 } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const { board: board01 } = await setupTestBoardWithEndpoint(
            context,
            req,
            org01.customId
        );

        const { board: board02 } = await setupTestBoardWithEndpoint(
            context,
            req,
            org01.customId
        );

        const result = await endpoint({ organizationId: org01.customId }, req);
        assertResultOk(result);
        expect(result.boards).toHaveLength(2);
        expect(result?.boards).toContainEqual(board01);
        expect(result?.boards).toContainEqual(board02);
    });
});
