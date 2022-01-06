import assert from "assert";
import RequestData from "../../RequestData";
import { testData } from "../../testUtils/data";
import { setupTestClient } from "../../testUtils/setupTestClient";
import {
    setupTestExpressRequest,
    setupTestExpressRequestWithClient,
} from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { getTestBaseContext } from "../../testUtils/TestBaseContext";
import { findErrorByName } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../utils";
import { EmailAddressNotAvailableError } from "../errors";
import signup from "../signup/signup";
import { ISignupArgData } from "../signup/types";

/**
 * - tests that a user can signup
 * - tests that signup fails if a user with the same email address exists
 * - tests that the api reuses an existing client
 */

const input: ISignupArgData = {
    user: {
        name: testData.testUser00.name,
        email: testData.testUser00.email,
        password: testData.testUser00.password,
        color: testData.testUser00.color,
    },
};

describe("signup", () => {
    test("can signup", async () => {
        /**
         * - test that a user is created
         * - test that a client is created
         * - test that a token is created
         * - test that there are no errors
         * - test that a root block is created for the user
         */

        const context = getTestBaseContext();
        const { req } = setupTestExpressRequest();

        // @ts-ignore
        const reqData = RequestData.fromExpressRequest(context, req, input);
        const result = await signup(context, reqData);

        expect(result).toBeTruthy();
        expect(result?.errors).toBeFalsy();
        expect(result?.token).toBeTruthy();
        expect(result?.client).toBeTruthy();
        expect(result?.user).toMatchObject({
            name: testData.testUser00.name,
            email: testData.testUser00.email,
            color: testData.testUser00.color,
        });

        const decodedToken = context.token.decodeToken(context, result?.token);
        const tokenData = await context.token.getTokenById(
            context,
            decodedToken.sub.id
        );

        expect(tokenData).toBeTruthy();

        const client = await context.client.getClientById(
            context,
            result?.client.clientId
        );

        expect(client).toBeTruthy();

        const user = await context.user.getUserById(
            context,
            result.user.customId
        );

        expect(user).toBeTruthy();

        const rootBlock = await context.block.getBlockById(
            context,
            user.rootBlockId
        );

        expect(rootBlock).toBeTruthy();
    });

    test("returns error if user exists", async () => {
        /**
         * - test that signup fails
         * - test that an EmailAddressNotAvailableError error is returned
         */

        const context = getTestBaseContext();
        await setupTestUser(context);

        const { req } = setupTestExpressRequest();
        const reqData = RequestData.fromExpressRequest(context, req, input);

        try {
            await signup(context, reqData);
            throw new Error(
                "Bug in our code: signup should throw EmailAddressNotAvailableError error"
            );
        } catch (error) {
            expect(error?.name).toEqual(EmailAddressNotAvailableError.name);
        }
    });

    test("reuses existing clients", async () => {
        /**
         * - test that if an existing client ID is passed, it gets reused
         */

        const context = getTestBaseContext();
        const { client } = await setupTestClient(context);
        const { req } = setupTestExpressRequestWithClient({ client });
        const reqData = RequestData.fromExpressRequest(context, req, input);
        const result = await signup(context, reqData);

        expect(result).toBeTruthy();
        expect(result?.client).toBeTruthy();
        expect(result?.client?.clientId).toEqual(client.clientId);
    });
});
