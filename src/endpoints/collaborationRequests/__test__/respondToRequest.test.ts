import { CollaborationRequestStatusType } from "../../../mongo/collaboration-request";
import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaborationRequestWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaborationRequestWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import respondToRequest from "../respondToRequest/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(respondToRequest, context);

describe("respond to request", () => {
    test("request accepted", async () => {
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

        const result = await endpoint(
            {
                requestId: requests[0].customId,
                response: CollaborationRequestStatusType.Accepted,
            },
            req02.req
        );

        assertResultOk(result);
        expect(result.organization?.customId).toEqual(organization.customId);
        expect(result.respondedAt).toBeTruthy();
        const request =
            await context.collaborationRequest.assertGetCollaborationRequestById(
                context,
                requests[0].customId
            );

        expect(
            request.statusHistory[request.statusHistory.length - 1]
        ).toMatchObject({
            status: CollaborationRequestStatusType.Accepted,
        });

        const user02FromDb = await context.user.assertGetUserById(
            context,
            user02.user.customId
        );

        expect(user02FromDb.orgs).toContainEqual({
            customId: organization.customId,
        });
    });

    test("request declined", async () => {
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

        const result = await endpoint(
            {
                requestId: requests[0].customId,
                response: CollaborationRequestStatusType.Declined,
            },
            req02.req
        );

        assertResultOk(result);
        const request =
            await context.collaborationRequest.assertGetCollaborationRequestById(
                context,
                requests[0].customId
            );

        expect(
            request.statusHistory[request.statusHistory.length - 1]
        ).toMatchObject({
            status: CollaborationRequestStatusType.Declined,
        });
    });
});
