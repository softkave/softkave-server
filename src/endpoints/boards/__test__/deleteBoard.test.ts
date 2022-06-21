import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import deleteBoard from "../deleteBoard/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(deleteBoard, context);

describe("delete board", () => {
    test("can delete board", async () => {
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

        const result = await endpoint({ boardId: board01.customId }, req);
        assertResultOk(result);
        const board = await context.block.getBlockById(
            context,
            result?.board.customId
        );

        expect(board).toBeFalsy();
    });
});
