
import { IBlock, BlockType } from "../../../mongo/block";
import { assertBlock } from "../../../mongo/block/utils";
import { ISprint } from "../../../mongo/sprint";
import { ITaskHistoryItem, TaskHistoryAction } from "../../../mongo/task-history";
import { IUser } from "../../../mongo/user";
import { indexArray, getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { IBaseContext } from "../../contexts/BaseContext";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { getPublicBlockData } from "../utils";
import persistBoardLabelChanges from "./persistBoardLabelChanges";
import persistBoardResolutionsChanges from "./persistBoardResolutionsChanges";
import persistBoardStatusChanges from "./persistBoardStatusChanges";
import processUpdateBlockInput from "./processUpdateBlockInput";
import sendNewlyAssignedTaskEmail from "./sendNewAssignedTaskEmail";
import { IUpdateBlockInput, UpdateBlockEndpoint } from "./types";
import { updateBlockJoiSchema } from "./validation";

const updateBlock: UpdateBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateBlockJoiSchema);
    const updateData = data.data;
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    assertBlock(block);
    canReadBlock({ user, block });

    // Parent update ( tranferring block ) is handled separately by transferBlock
    const parentInput = updateData.parent;
    delete updateData.parent;

    let oldSprint: ISprint | null = null;
    let newSprint: ISprint | null = null;
    let oldSprintId = "";
    let newSprintId = "";
    const board = await context.block.getBlockById(context, block.parent!);
    const sprintIds: string[] = [];
    let sprintsResult: ISprint[] = [];

    if (block.taskSprint?.sprintId) {
        sprintIds.push(block.taskSprint.sprintId);
        oldSprintId = block.taskSprint.sprintId;
    }

    if (data.data.taskSprint?.sprintId) {
        sprintIds.push(data.data.taskSprint.sprintId);
        newSprintId = data.data.taskSprint.sprintId;
    }

    if (sprintIds.length > 0) {
        sprintsResult = await context.sprint.getMany(context, sprintIds);
    }

    sprintsResult.forEach((sprint) => {
        switch (sprint.customId) {
            case oldSprintId:
                oldSprint = sprint;
                break;

            case newSprintId:
                newSprint = sprint;
                break;
        }
    });

    const update = processUpdateBlockInput(
        block,
        updateData,
        user,
        board,
        oldSprint,
        newSprint
    );

    if (update.assignees?.length > 0) {
        const users = await context.user.bulkGetUsersById(
            context,
            update.assignees.map((a) => a.userId)
        );

        const usersMap = indexArray(users, { path: "customId" });
        update.assignees = update.assignees.filter((a) => {
            const assigneeUserData = usersMap[a.userId];

            if (!assigneeUserData) {
                return false;
            }

            return !!assigneeUserData.orgs.find(
                (o) => o.customId === block.rootBlockId
            );
        });
    }

    let updatedBlock = await context.block.updateBlockById(
        context,
        data.blockId,
        update
    );

    context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
        block,
        updateType: { isUpdate: true },
        data: update,
        blockId: block.customId,
        blockType: block.type,
        parentId: block.parent,
    });

    // TODO: should we wait for these to complete, cause a user can reload while they're pending
    // and get incomplete/incorrect data
    fireAndForgetPromise(
        persistBoardStatusChanges(context, instData, block, update, user)
    );
    fireAndForgetPromise(
        persistBoardResolutionsChanges(context, instData, block, update)
    );
    fireAndForgetPromise(
        persistBoardLabelChanges(context, instData, block, update)
    );
    fireAndForgetPromise(
        sendNewlyAssignedTaskEmail(
            context,
            instData,
            block,
            update,
            updatedBlock
        )
    );
    // fireAndForgetPromise(
    //     insertTaskHistoryItem(context, user, block, updateData)
    // );

    if (parentInput && block.parent !== parentInput) {
        const result = await context.transferBlock(context, {
            ...instData,
            data: {
                destinationBlockId: parentInput,
                draggedBlockId: block.customId,
            },
        });

        updatedBlock = result.draggedBlock;
    }

    return { block: getPublicBlockData(updatedBlock) };
};

export default updateBlock;

export async function insertTaskHistoryItem(
    context: IBaseContext,
    user: IUser,
    existingBlock: IBlock,
    input: IUpdateBlockInput
) {
    if (
        existingBlock.type === BlockType.Task ||
        existingBlock.status === input.status
    ) {
        return;
    }

    const historyItem: ITaskHistoryItem = {
        customId: getNewId(),
        organizationId: existingBlock.rootBlockId!,
        boardId: existingBlock.parent!,
        taskId: existingBlock.customId,
        action: TaskHistoryAction.StatusUpdated,
        createdAt: getDateString(),
        createdBy: user.customId,
        value: input.status,
        timeToStage:
            new Date(
                existingBlock.statusAssignedAt || existingBlock.createdAt
            ).valueOf() - new Date().valueOf(),
        timeSpentSoFar:
            new Date(existingBlock.createdAt).valueOf() - new Date().valueOf(),
    };

    await context.taskHistory.insert(context, historyItem);
}
