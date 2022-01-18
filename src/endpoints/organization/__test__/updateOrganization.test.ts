import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import updateOrganization from "../updateOrganization/handler";
import { IUpdateOrganizationInput } from "../updateOrganization/types";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(updateOrganization, context);

describe("update organization", () => {
    test("can update organization", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const input: IUpdateOrganizationInput = {
            name: chance.company(),
            description: chance.sentence({ words: 12 }),
            color: chance.color({ format: "hex" }),
        };

        const { organization: org01 } = await setupTestOrganizationWithEndpoint(
            context,
            req,
            input
        );

        const result = await endpoint(
            { organizationId: org01.customId, data: input },
            req
        );

        assertResultOk(result);
        expect(result?.organization).toMatchObject(input);
        const organization = await context.block.assertGetBlockById(
            context,
            result?.organization.customId
        );

        expect(organization).toMatchObject(input);
    });
});
