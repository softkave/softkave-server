import { chance } from "../../testUtils/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../utils";
import organizationExists from "../organizationExists/handler";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(organizationExists);

describe("organization exists", () => {
    test("organization exists if it does", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const orgName = chance.company();
        const { organization: org01 } = await setupTestOrganizationWithEndpoint(
            context,
            req,
            { name: orgName }
        );

        const result = await endpoint({ name: org01.name }, req);
        assertResultOk(result);
        expect(result?.exists).toBeTruthy();
    });

    test("organization does not exist if it does not", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const result = await endpoint({ name: chance.company() }, req);
        assertResultOk(result);
        expect(result?.exists).toBeFalsy();
    });
});
