import RequestData from "../../RequestData";
import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance, testData } from "../../testUtils/data/data";
import { setupTestClient } from "../../testUtils/setupTestClient";
import {
    setupTestExpressRequest,
    setupTestExpressRequestWithClient,
} from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import { EmailAddressNotAvailableError } from "../errors";
import signup from "../signup/signup";
import { ISignupArgData } from "../signup/types";

/**
 * - tests that a user can signup
 * - tests that signup fails if a user with the same email address exists
 * - tests that the api reuses an existing client
 */

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
        const input: ISignupArgData = {
            user: {
                name: chance.first(),
                email: chance.email(),
                password: testData.testUser00.password,
                color: testData.testUser00.color,
            },
        };

        const reqData = RequestData.fromExpressRequest(context, req, input);
        const result = await signup(context, reqData);

        expect(result).toBeTruthy();
        expect(result?.errors).toBeFalsy();
        expect(result?.token).toBeTruthy();
        expect(result?.client).toBeTruthy();
        expect(result?.user).toMatchObject({
            name: input.user.name,
            email: input.user.email,
            color: input.user.color,
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
        const endpoint = wrapEndpointREST(signup, context);
        const { req } = setupTestExpressRequest();
        const input01: ISignupArgData = {
            user: {
                name: chance.first(),
                email: chance.email(),
                password: testData.testUser00.password,
                color: testData.testUser00.color,
            },
        };

        await endpoint(input01, req);
        const result = await endpoint(input01, req);
        expect(result?.errors).toHaveLength(1);
        expect(result?.errors[0].name).toEqual(
            EmailAddressNotAvailableError.name
        );
    });

    test("reuses existing clients", async () => {
        /**
         * - test that if an existing client ID is passed, it gets reused
         */

        const context = getTestBaseContext();
        const { client } = await setupTestClient(context);
        const { req } = setupTestExpressRequestWithClient({ client });
        const input: ISignupArgData = {
            user: {
                name: chance.first(),
                email: chance.email(),
                password: testData.testUser00.password,
                color: testData.testUser00.color,
            },
        };

        const reqData = RequestData.fromExpressRequest(context, req, input);
        const result = await signup(context, reqData);

        expect(result).toBeTruthy();
        expect(result?.client).toBeTruthy();
        expect(result?.client?.clientId).toEqual(client.clientId);
    });
});