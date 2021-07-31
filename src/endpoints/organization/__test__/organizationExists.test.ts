import RequestData from "../../RequestData";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { wrapEndpoint } from "../../utils";
import organizationExists from "../organizationExists/handler";
import { IOrganizationExistsParameters } from "../organizationExists/types";

const context = getTestBaseContext();

const input: IOrganizationExistsParameters = {
    name: "Test organization",
};

const endpoint = (data, req) => {
    return wrapEndpoint(data, req, async () =>
        // @ts-ignore
        organizationExists(
            context,
            await RequestData.fromExpressRequest(context, req, data)
        )
    );
};

describe("organization exists", () => {
    test("organization exists", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const result = await endpoint(input, req);
        expect(result).toBeTruthy();
        expect(result?.errors).toBeFalsy();
        expect(result?.exists).toBeFalsy();
    });
});
