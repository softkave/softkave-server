import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { INewBoardInput } from "../types";

const context = getTestBaseContext();

describe("create custom property", () => {
    test("can create custom property", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const { organization } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const input: INewBoardInput = {
            name: chance.company(),
            description: chance.sentence({ words: 15 }),
            color: chance.color({ format: "hex" }),
            parent: organization.customId,
            boardLabels: [],
            boardResolutions: [],
            boardStatuses: [],
        };

        const result = await setupTestBoardWithEndpoint(
            context,
            req,
            organization.customId,
            input
        );

        expect(result?.board).toMatchObject(input);
        const board = await context.block.getBlockById(
            context,
            result?.board.customId
        );

        expect(board).toBeTruthy();
        expect(result?.board.customId).toEqual(board.customId);
    });
});
