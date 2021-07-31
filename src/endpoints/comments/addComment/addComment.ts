import { assertBlock } from "../../../mongo/block/utils";
import { getDate } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../../block/canReadBlock";
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
    //         organizationId: getBlockRootBlockId(task),
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

    return {
        comment: getPublicCommentData(savedComment),
    };
};

export default addComment;
