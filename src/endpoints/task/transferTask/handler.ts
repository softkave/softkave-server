import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { IBoard } from "../../board/types";
import { throwBoardNotFoundError } from "../../board/utils";
import { ITask } from "../types";
import { getPublicTaskData, throwTaskNotFoundError } from "../utils";
import { TransferTaskEndpoint } from "./types";
import { transferTaskJoiSchema } from "./validation";

const transferTask: TransferTaskEndpoint = async (context, instData) => {
    const data = validate(instData.data, transferTaskJoiSchema);
    const user = await context.session.getUser(context, instData);

    const [task, board] = await Promise.all([
        context.block.assertGetBlockById<ITask>(
            context,
            data.taskId,
            throwTaskNotFoundError
        ),
        context.block.assertGetBlockById<IBoard>(
            context,
            data.boardId,
            throwBoardNotFoundError
        ),
    ]);

    // TODO: check that all parents are of the block's parent type

    if (task.parent === board.customId) {
        return;
    }

    const status0 = board.boardStatuses[0];
    const taskUpdates: Partial<ITask> = {
        updatedAt: getDate(),
        updatedBy: user.customId,
        parent: board.customId,
        status: status0 ? status0.customId : null,
        statusAssignedAt: status0 ? getDate() : null,
        statusAssignedBy: status0 ? user.customId : null,
        labels: [],
        taskSprint: null,
        taskResolution: null,
    };

    const updatedTask = await context.block.updateBlockById<ITask>(
        context,
        task.customId,
        taskUpdates
    );

    return {
        task: getPublicTaskData(updatedTask),
    };
};

export default transferTask;
