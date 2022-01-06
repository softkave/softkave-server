import { chance } from "../../testUtils/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { INewOrganizationInput } from "../types";

const context = getTestBaseContext();

describe("create organization", () => {
    test("can create organization", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const input: INewOrganizationInput = {
            name: chance.company(),
            description: chance.paragraph(),
            color: chance.color(),
        };

        const result = await setupTestOrganizationWithEndpoint(
            context,
            req,
            input
        );

        expect(result?.organization).toMatchObject(input);
        const organization = await context.block.getBlockById(
            context,
            result?.organization.customId
        );

        expect(organization).toBeTruthy();
        expect(result?.organization.customId).toEqual(organization.customId);
    });
});
