import { CollaborationRequestStatusType } from "../../../mongo/collaboration-request";
import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaborationRequestWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaborationRequestWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import { makeRevokeRequestContext } from "../revokeRequest/context";
import revokeRequest from "../revokeRequest/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(
    revokeRequest,
    makeRevokeRequestContext(context)
);

describe("revoke request", () => {
    test("can revoke request", async () => {
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
            {
                organizationId: organization.customId,
                requestId: requests[0].customId,
            },
            req
        );

        assertResultOk(result);
        const request =
            await context.collaborationRequest.assertGetCollaborationRequestById(
                context,
                result?.request.customId
            );

        expect(
            request.statusHistory[request.statusHistory.length - 1]
        ).toMatchObject({
            status: CollaborationRequestStatusType.Revoked,
        });
    });
});
