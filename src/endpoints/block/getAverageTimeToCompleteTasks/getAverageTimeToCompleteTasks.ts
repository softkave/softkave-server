import { assertBlock } from "../../../mongo/block/utils";
import { TaskHistoryAction } from "../../../mongo/task-history";
import { validate } from "../../../utilities/joiUtils";
import { GetAverageTimeToCompleteTasksEndpoint } from "./types";
import { getAverageTimeToCompleteTasksJoiSchema } from "./validation";

// const getAverageTimeToCompleteTasks: GetAverageTimeToCompleteTasksEndpoint =
//     async (context, instData) => {
//         const data = validate(
//             instData.data,
//             getAverageTimeToCompleteTasksJoiSchema
//         );

//         await context.session.assertUser(context, instData);
//         const board = await context.block.getBlockById(context, data.boardId);
//         assertBlock(board);
//         const statuses = board.boardStatuses;

//         if (statuses.length === 0) {
//             return { avg: 0 };
//         }

//         const lastStatus = statuses[statuses.length - 1];

//         // TODO: batch process computation
//         const items = await context.taskHistory.getMany(context, {
//             boardId: data.boardId,
//             action: TaskHistoryAction.StatusUpdated,
//             value: lastStatus?.customId,
//         });

//         if (items.length === 0) {
//             return { avg: 0 };
//         }

//         const count = items.length;
//         const totalTime = items.reduce(
//             (total, item) => total + (item.timeSpentSoFar || 0),
//             0
//         );

//         const avg = totalTime / count;
//         return { avg };
//     };

const getAverageTimeToCompleteTasks: GetAverageTimeToCompleteTasksEndpoint =
    async (context, instData) => {
        const data = validate(
            instData.data,
            getAverageTimeToCompleteTasksJoiSchema
        );

        await context.session.assertUser(context, instData);
        const board = await context.block.getBlockById(context, data.boardId);
        assertBlock(board);
        const statuses = board.boardStatuses;

        if (statuses.length === 0) {
            return { avg: 0 };
        }

        const lastStatus = statuses[statuses.length - 1];

        // TODO: batch process computation
        const tasks = await context.block.getTasksByStatus(
            context,
            board.customId,
            lastStatus.customId
        );

        if (tasks.length === 0) {
            return { avg: 0 };
        }

        const count = tasks.length;
        const totalTime = tasks.reduce((total, item) => {
            if (!item.statusAssignedAt) {
                return total;
            }

            const createdAt = new Date(item.createdAt).valueOf();
            const statusAssignedAt = new Date(item.statusAssignedAt).valueOf();
            return total + (statusAssignedAt - createdAt);
        }, 0);

        const avg = totalTime / count;
        return { avg };
    };

export default getAverageTimeToCompleteTasks;
