import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaboratorWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaboratorWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import removeCollaborator from "../removeCollaborator/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(removeCollaborator, context);

describe("remove collaborator", () => {
    test("can remove collaborator", async () => {
        const user01 = await setupTestUser(context);
        const user02 = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({
            token: user01.token,
        });

        const { organization: org01 } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        await setupTestCollaboratorWithEndpoint(
            context,
            req,
            org01.customId,
            user01.user.email,
            user02.token
        );

        let user02FromDb = await context.user.assertGetUserById(
            context,
            user02.user.customId
        );

        expect(user02FromDb.orgs).toContainEqual({
            customId: org01.customId,
        });

        const result = await endpoint(
            {
                organizationId: org01.customId,
                collaboratorId: user02.user.customId,
            },
            req
        );

        assertResultOk(result);
        user02FromDb = await context.user.assertGetUserById(
            context,
            user02.user.customId
        );

        expect(user02FromDb.orgs).not.toContainEqual({
            customId: org01.customId,
        });
    });
});
