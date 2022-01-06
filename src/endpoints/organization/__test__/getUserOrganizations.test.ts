import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../utils";
import getUserOrganizations from "../getUserOrganizations/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(getUserOrganizations);

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
        expect(result?.organizations).toContain(org01);
        expect(result?.organizations).toContain(org02);
    });
});
