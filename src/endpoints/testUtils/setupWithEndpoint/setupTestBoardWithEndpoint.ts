import assert from "assert";
import createBoard from "../../boards/createBoard/handler";
import { ICreateBoardParameters } from "../../boards/createBoard/types";
import { INewBoardInput } from "../../boards/types";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IServerRequest } from "../../contexts/types";
import RequestData from "../../RequestData";
import { chance } from "../data/data";
import { assertResultOk } from "../utils";

export async function setupTestBoardWithEndpoint(
  context: IBaseContext,
  req: IServerRequest,
  orgId: string,
  base: Partial<INewBoardInput> = {}
) {
  const result = await createBoard(
    context,
    RequestData.fromExpressRequest<ICreateBoardParameters>(context, req, {
      board: {
        name: chance.word(),
        description: chance.sentence({ words: 15 }),
        color: chance.color({ format: "hex" }),
        parent: orgId,
        boardLabels: [],
        boardResolutions: [],
        boardStatuses: [],
        ...base,
      },
    })
  );

  assertResultOk(result);
  assert.ok(result.board);
  return {
    board: result.board,
  };
}
