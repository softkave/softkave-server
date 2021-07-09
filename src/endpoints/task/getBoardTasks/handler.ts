import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { IBoard } from "../../board/types";
import { throwBoardNotFoundError } from "../../board/utils";
import canReadOrg from "../../org/canReadBlock";
import { ITask } from "../types";
import { getPublicTasksArray } from "../utils";
import { GetBoardTasksEndpoint } from "./types";
import { getBoardTasksJoiSchema } from "./validation";

const getBoardTasks: GetBoardTasksEndpoint = async (context, instData) => {
    const data = validate(instData.data, getBoardTasksJoiSchema);
    const user = await context.session.getUser(context, instData);
    const board = await context.block.assertGetBlockById<IBoard>(
        context,
        data.boardId,
        throwBoardNotFoundError
    );

    canReadOrg(board.rootBlockId, user);

    const tasks = await context.block.getBlockChildren<ITask>(
        context,
        data.boardId,
        [BlockType.Task]
    );

    return {
        tasks: getPublicTasksArray(tasks),
    };
};

export default getBoardTasks;
