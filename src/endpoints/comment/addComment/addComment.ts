import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
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
    const comment: IComment = {
        customId: data.customId,
        taskId: data.taskId,
        comment: data.comment,
        createdBy: user.customId,
        createdAt: now,
    };

    const savedComment = await context.comment.createComment(context, comment);
    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Create,
        resourceId: comment.customId,
        resourceType: AuditLogResourceType.Comment,
        organizationId: getBlockRootBlockId(task),
        resourceOwnerId: task.customId,
    });

    return {
        comment: getPublicCommentData(savedComment),
    };
};

export default addComment;
