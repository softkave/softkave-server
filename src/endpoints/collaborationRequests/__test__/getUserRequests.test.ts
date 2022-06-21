import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaborationRequestWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaborationRequestWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import getUserRequests from "../getUserRequests/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getUserRequests, context);

describe("get user requests", () => {
    test("can get requests", async () => {
        const user01 = await setupTestUser(context);
        const user02 = await setupTestUser(context);
        const req01 = setupTestExpressRequestWithToken({ token: user01.token });
        const req02 = setupTestExpressRequestWithToken({ token: user02.token });
        const { organization } = await setupTestOrganizationWithEndpoint(
            context,
            req01.req
        );

        await setupTestCollaborationRequestWithEndpoint(
            context,
            req01.req,
            organization.customId,
            [{ email: user02.user.email }]
        );

        const result = await endpoint(undefined, req02.req);
        assertResultOk(result);
        expect(result.requests).toHaveLength(1);
        expect(result?.requests).toContainEqual({
            to: { email: user02.user.email },
        });
    });
});
