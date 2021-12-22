import { BlockType, IBlock } from "../../../mongo/block";
import {
    ITaskHistoryItem,
    TaskHistoryAction,
} from "../../../mongo/task-history";
import { IUser } from "../../../mongo/user";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { IBaseContext } from "../../contexts/BaseContext";
import { fireAndForgetPromise } from "../../utils";
import { BlockExistsError } from "../errors";
import manualProcessInternalAddBlockInput from "./manualProcessInternalAddBlockInput";
import { InternalAddBlockEndpoint } from "./types";

const internalAddBlock: InternalAddBlockEndpoint = async (
    context,
    instData
) => {
    const user = await context.session.getUser(context, instData);
    const inputBlock = instData.data.block;

    if (inputBlock.type !== BlockType.Task) {
        const blockExists = await context.block.blockExists(
            context,
            inputBlock.name,
            inputBlock.type,
            inputBlock.parent
        );

        if (blockExists) {
            // TODO: do a mapping of the correct error field name from called endpoints to the calling endpoints
            // TODO: error field names should not be hardcoded
            throw new BlockExistsError({
                blockType: inputBlock.type,
                field: "name",
            });
        }
    }

    const block = manualProcessInternalAddBlockInput(inputBlock, user);
    const savedBlock = await context.block.saveBlock(context, block);

    return {
        block: savedBlock,
    };
};

export default internalAddBlock;

export async function insertTaskHistoryItem(
    context: IBaseContext,
    user: IUser,
    newBlock: IBlock
) {
    if (newBlock.type === BlockType.Task) {
        return;
    }

    const historyItem: ITaskHistoryItem = {
        customId: getNewId(),
        organizationId: newBlock.rootBlockId!,
        boardId: newBlock.parent!,
        taskId: newBlock.customId,
        action: TaskHistoryAction.StatusUpdated,
        createdAt: getDateString(),
        createdBy: user.customId,
        value: newBlock.status,
        timeToStage: 0,
        timeSpentSoFar: 0,
    };

    await context.taskHistory.insert(context, historyItem);
}
