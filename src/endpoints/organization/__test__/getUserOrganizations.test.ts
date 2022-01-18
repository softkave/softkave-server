import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import getUserOrganizations from "../getUserOrganizations/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getUserOrganizations, context);

describe("get user organizations", () => {
    test("can get organizations", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const { organization: org01 } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const { organization: org02 } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const result = await endpoint(undefined, req);
        assertResultOk(result);
        expect(result?.organizations).toContainEqual(org01);
        expect(result?.organizations).toContainEqual(org02);
    });
});
