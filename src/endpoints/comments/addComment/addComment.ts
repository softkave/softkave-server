import { SystemActionType, SystemResourceType } from "../../../mongo/audit-log";
import { IComment } from "../../../mongo/comment";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
import { getBlockRootBlockId } from "../../block/utils";
import { getPublicCommentData } from "../utils";
import { AddCommentEndpoint } from "./types";
import { newComment } from "./validation";

const addComment: AddCommentEndpoint = async (context, instData) => {
    const data = validate(instData.data.comment, newComment);
    const user = await context.session.getUser(context, instData);
    const task = await context.block.getBlockById(context, data.taskId);

    await canReadBlock({ user, block: task });

    const now = getDate();

    const savedComment = await context.comment.createComment(context, {
        taskId: data.taskId,
        comment: data.comment,
        createdBy: user.customId,
        createdAt: now,
    });

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Create,
        resourceId: savedComment.customId,
        resourceType: SystemResourceType.Comment,
        organizationId: getBlockRootBlockId(task),
        resourceOwnerId: task.customId,
    });

    return {
        comment: getPublicCommentData(savedComment),
    };
};

export default addComment;
