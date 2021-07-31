import RequestData from "../../RequestData";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { wrapEndpoint } from "../../utils";
import getUserOrganizations from "../getUserOrganizations/handler";

const context = getTestBaseContext();

const endpoint = (data, req) => {
    return wrapEndpoint(data, req, async () =>
        // @ts-ignore
        getUserOrganizations(
            context,
            await RequestData.fromExpressRequest(context, req, data)
        )
    );
};

describe("get user organizations", () => {
    test("can get organizations", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const result = await endpoint(undefined, req);
        expect(result).toBeTruthy();
        expect(result?.errors).toBeFalsy();
        expect(result?.organizations).toBeTruthy();
    });
});
