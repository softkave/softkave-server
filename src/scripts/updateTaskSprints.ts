import { fireAndForgetPromise } from "../endpoints/utils";
import {
    BlockType,
    getBlockModel,
    IBlock,
    IBlockDocument,
} from "../mongo/block";
import { getSprintModel } from "../mongo/sprint";
import { indexArray } from "../utilities/fns";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";

// Update task sprints where the sprint is deleted, or the
// the sprint is completed, but the task is not yet completed
export async function script_updateTaskSprints() {
    logScriptStarted(script_updateTaskSprints);

    const blockModel = getBlockModel();
    const sprintModel = getSprintModel();

    await blockModel.waitTillReady();
    await sprintModel.waitTillReady();

    const sprints = await sprintModel.model.find({}).lean().exec();
    const sprintsMap = indexArray(sprints, { path: "customId" });

    const boardsMap: Record<string, IBlock> = {};

    const cursor = blockModel.model.find({ type: BlockType.Task }).cursor();
    let docsCount = 0;

    try {
        for (
            let doc: IBlockDocument = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            if (!doc.taskSprint?.sprintId) {
                continue;
            }

            const sprint = sprintsMap[doc.taskSprint.sprintId];

            if (!sprint) {
                docsCount++;
                doc.taskSprint = null;
                fireAndForgetPromise(doc.save());
                continue;
            }

            if (sprint.endDate) {
                let board = boardsMap[doc.parent!];

                if (!board) {
                    board = await blockModel.model
                        .findOne({ customId: doc.parent! })
                        .lean()
                        .exec();

                    boardsMap[doc.parent] = board;
                }

                if (!board) {
                    console.log(
                        `Board for task with id '${doc.customId}' does not exist!`
                    );
                    continue;
                }

                const statusList = board.boardStatuses || [];
                const taskCompleteStatus = statusList[statusList.length - 1];

                if (doc.status !== taskCompleteStatus.customId) {
                    docsCount++;
                    doc.taskSprint = null;
                    fireAndForgetPromise(doc.save());
                    continue;
                }
            }
        }

        cursor.close();
        console.log(`task(s) count = ${docsCount}`);
        logScriptSuccessful(script_updateTaskSprints);
    } catch (error) {
        logScriptFailed(script_updateTaskSprints, error);
    }
}
