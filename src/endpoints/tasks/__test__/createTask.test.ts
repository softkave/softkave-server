import { BlockPriority } from "../../../mongo/block";
import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestBoardWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestBoardWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { setupTestTaskWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestTaskWithEndpoint";
import { INewTaskInput } from "../types";

const context = getTestBaseContext();

describe("create board", () => {
  test("can create board", async () => {
    const { token } = await setupTestUser(context);
    const { req } = setupTestExpressRequestWithToken({ token });
    const { organization } = await setupTestOrganizationWithEndpoint(
      context,
      req
    );

    const { board } = await setupTestBoardWithEndpoint(
      context,
      req,
      organization.customId
    );

    const input: INewTaskInput = {
      name: chance.sentence(),
      description: chance.sentence({ words: 20 }),
      parent: board.customId,
      rootBlockId: organization.customId,
      assignees: [],
      priority: BlockPriority.Medium,
      subTasks: [],
      labels: [],
    };

    const result = await setupTestTaskWithEndpoint(
      context,
      req,
      organization.customId,
      board.customId,
      input
    );

    expect(result?.task).toMatchObject(input);
    const task = await context.block.getBlockById(
      context,
      result?.task.customId
    );

    expect(task).toBeTruthy();
    expect(result?.task.customId).toEqual(task.customId);
  });
});
