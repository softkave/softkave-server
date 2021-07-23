import RequestData from "../../RequestData";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { wrapEndpoint } from "../../utils";
import createOrganization from "../createOrganization/handler";
import { ICreateOrganizationParameters } from "../createOrganization/types";

const context = getTestBaseContext();

const input: ICreateOrganizationParameters = {
    organization: {
        name: "Test organization",
        description: "Test description",
        color: "#ffa39e",
    },
};

const endpoint = (data, req) => {
    return wrapEndpoint(data, req, async () =>
        // @ts-ignore
        createOrganization(
            context,
            await RequestData.fromExpressRequest(context, req, data)
        )
    );
};

describe("create organization", () => {
    test("can create organization", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const result = await endpoint(input, req);
        expect(result).toBeTruthy();
        expect(result?.errors).toBeFalsy();
        expect(result?.organization).toMatchObject(input.organization);

        const organization = await context.block.getBlockById(
            context,
            result?.organization.customId
        );

        expect(organization).toBeTruthy();
        expect(result?.organization.customId).toEqual(organization.customId);
    });
});
