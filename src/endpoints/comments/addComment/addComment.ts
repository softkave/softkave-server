import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
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

    assertBlock(task);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: getBlockRootBlockId(task),
    //         resourceType: SystemResourceType.Comment,
    //         action: SystemActionType.Create,
    //         permissionResourceId: task.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: task });

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
