import {
    BlockPriority,
    BlockType,
    IBlockStatus,
    ISubTask,
} from "../../../mongo/block";
import { getDate, getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import broadcastBlockUpdate from "../../block/broadcastBlockUpdate";
import { INewBlockInput } from "../../block/types";
import { fireAndForgetPromise } from "../../utils";
import { systemConstants } from "../constants";
import { SendFeedbackEndpoint } from "./types";
import { sendFeedbackJoiSchema } from "./validation";

const sendFeedback: SendFeedbackEndpoint = async (context, instData) => {
    const data = validate(instData.data, sendFeedbackJoiSchema);
    const user = await context.session.tryGetUser(context, instData);
    const feedbackBoard = await context.block.getBlockById(
        context,
        systemConstants.feedbackBoardId
    );

    const statuses = feedbackBoard.boardStatuses || [];
    const status0: IBlockStatus | undefined = statuses[0];
    const subTasks: ISubTask[] = [];

    if (user) {
        subTasks.push({
            customId: getNewId(),
            description: `Reach out to ${user.email} on progress of feedback or anything else.`,
            createdAt: getDate(),
            createdBy: systemConstants.yomi,
        });
    }

    const task: INewBlockInput = {
        subTasks,
        customId: getNewId(),
        type: BlockType.Task,
        name: data.title,
        description: data.message,
        parent: feedbackBoard.customId,
        rootBlockId: feedbackBoard.rootBlockId,
        priority: BlockPriority.Important,
        status: status0 ? status0.customId : undefined,
        statusAssignedBy: systemConstants.yomi,
        statusAssignedAt: getDateString(),
    };

    const savedTaskResult = await context.saveTask(context, {
        ...instData,
        data: {
            block: task,
        },
    });

    fireAndForgetPromise(
        broadcastBlockUpdate({
            context,
            instData,
            blockId: task.customId,
            updateType: { isNew: true },
            blockType: BlockType.Task,
            data: savedTaskResult.block,
            parentId: feedbackBoard.customId,
            block: savedTaskResult.block,
        })
    );
};

export default sendFeedback;
