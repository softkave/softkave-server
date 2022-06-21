import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { assertResultOk } from "../../testUtils/utils";
import { wrapEndpointREST } from "../../wrapEndpointREST";
import { makeUpdateBoardContext } from "../updateBoard/context";
import updateBoard from "../updateBoard/handler";
import { IUpdateBoardInput } from "../updateBoard/types";

const context = getTestBaseContext();
const endpoint = wrapEndpointREST(updateBoard, makeUpdateBoardContext(context));

describe("update board", () => {
    test("can update board", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const input: IUpdateBoardInput = {
            name: chance.company(),
            description: chance.sentence({ words: 28 }),
            color: chance.color({ format: "hex" }),
        };

        const { organization: org01 } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const { board: board01 } = await setupTestBoardWithEndpoint(
            context,
            req,
            org01.customId
        );

        const result = await endpoint(
            { boardId: board01.customId, data: input },
            req
        );

        assertResultOk(result);
        expect(result?.board).toMatchObject(input);
        const board = await context.block.assertGetBlockById(
            context,
            result?.board.customId
        );

        expect(board).toMatchObject(input);
    });
});
