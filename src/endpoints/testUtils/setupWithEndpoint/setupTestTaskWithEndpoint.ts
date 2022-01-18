import assert from "assert";
import { BlockPriority } from "../../../mongo/block";
import { IBaseContext } from "../../contexts/IBaseContext";
import { IServerRequest } from "../../contexts/types";
import RequestData from "../../RequestData";
import createTask from "../../task/createTask/handler";
import { ICreateTaskParameters } from "../../task/createTask/types";
import { INewTaskInput } from "../../task/types";
import { chance } from "../data/data";
import { assertResultOk } from "../utils";

export async function setupTestTaskWithEndpoint(
    context: IBaseContext,
    req: IServerRequest,
    orgId: string,
    boardId: string,
    base: Partial<INewTaskInput> = {}
) {
    const result = await createTask(
        context,
        RequestData.fromExpressRequest<ICreateTaskParameters>(context, req, {
            task: {
                name: chance.sentence(),
                description: chance.sentence({ words: 30 }),
                parent: boardId,
                rootBlockId: orgId,
                assignees: [],
                priority: BlockPriority.Medium,
                subTasks: [],
                labels: [],
                ...base,
            },
        })
    );

    assertResultOk(result);
    assert.ok(result.task);
    return {
        task: result.task,
    };
}
