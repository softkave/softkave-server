import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { setupTestTaskWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestTaskWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import deleteTask from "../deleteTask/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(deleteTask, context);

describe("delete task", () => {
    test("can delete task", async () => {
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

        const { task: task01 } = await setupTestTaskWithEndpoint(
            context,
            req,
            org01.customId,
            board01.customId
        );

        const result = await endpoint({ taskId: task01.customId }, req);
        assertResultOk(result);
        const task001 = await context.block.getBlockById(
            context,
            task01.customId
        );

        expect(task001).toBeFalsy();
    });
});
