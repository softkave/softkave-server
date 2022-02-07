import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaboratorWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaboratorWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import getOrganizationCollaborators from "../getOrganizationCollaborators/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getOrganizationCollaborators, context);

describe("get organization collaborators", () => {
    test("can get collaborators", async () => {
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

        const result = await endpoint({ organizationId: org01.customId }, req);
        assertResultOk(result);
        expect(result.collaborators).toHaveLength(1);
        expect(result?.collaborators).toContainEqual(user02.user);
    });
});
