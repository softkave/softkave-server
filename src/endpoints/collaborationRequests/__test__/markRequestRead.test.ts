import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaborationRequestWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaborationRequestWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import markRequestRead from "../markRequestRead/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(markRequestRead, context);

describe("mark request read", () => {
    test("can mark request read", async () => {
        const user01 = await setupTestUser(context);
        const user02 = await setupTestUser(context);
        const req01 = setupTestExpressRequestWithToken({ token: user01.token });
        const req02 = setupTestExpressRequestWithToken({ token: user02.token });
        const { organization } = await setupTestOrganizationWithEndpoint(
            context,
            req01.req
        );

        const { requests } = await setupTestCollaborationRequestWithEndpoint(
            context,
            req01.req,
            organization.customId,
            [{ email: user02.user.email }]
        );

        let request =
            await context.collaborationRequest.assertGetCollaborationRequestById(
                context,
                requests[0].customId
            );

        expect(request.readAt).toBeFalsy();
        const result = await endpoint(
            {
                requestId: requests[0].customId,
            },
            req02.req
        );

        assertResultOk(result);
        request =
            await context.collaborationRequest.assertGetCollaborationRequestById(
                context,
                result?.request.customId
            );

        expect(request.readAt).toBeTruthy();
    });
});
