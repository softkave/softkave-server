import { IServerRequest } from "../../contexts/types";
import RequestData from "../../RequestData";
import { chance } from "../../testUtils/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../utils";
import organizationExists from "../organizationExists/handler";
import { IOrganizationExistsParameters } from "../organizationExists/types";

const context = getTestBaseContext();

const input: IOrganizationExistsParameters = {
    name: "Test organization",
};

const endpoint = (data: IOrganizationExistsParameters, req: IServerRequest) => {
    return wrapEndpointREST(data, req, async () =>
        // @ts-ignore
        organizationExists(
            context,
            await RequestData.fromExpressRequest(context, req, data)
        )
    );
};

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

        const result = await endpoint(input, req);
        assertResultOk(result);
        expect(result?.exists).toBeFalsy();
    });

    test("organization does not exist if it does not", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const result = await endpoint(input, req);
        expect(result).toBeTruthy();
        expect(result?.errors).toBeFalsy();
        expect(result?.exists).toBeFalsy();
    });
});
