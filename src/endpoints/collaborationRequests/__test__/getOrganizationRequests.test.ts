import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaborationRequestWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaborationRequestWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import getOrganizationRequests from "../getOrganizationRequests/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getOrganizationRequests, context);

describe("get organization requests", () => {
    test("can get requests", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const { organization } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const { requests } = await setupTestCollaborationRequestWithEndpoint(
            context,
            req,
            organization.customId
        );

        const result = await endpoint(
            { organizationId: organization.customId },
            req
        );

        assertResultOk(result);
        expect(result.requests).toHaveLength(2);
        expect(result?.requests).toContainEqual(requests[0]);
        expect(result?.requests).toContainEqual(requests[1]);
    });
});
