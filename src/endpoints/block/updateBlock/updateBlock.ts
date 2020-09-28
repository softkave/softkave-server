import pick from "lodash/pick";
import { AuditLogActionType } from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType, IBlock } from "../../../mongo/block";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { fireAndForgetPromise } from "../../utils";
import broadcastBlockUpdate from "../broadcastBlockUpdate";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import processBoardLabelChanges from "./processBoardLabelChanges";
import processBoardStatusChanges from "./processBoardStatusChanges";
import sendNewlyAssignedTaskEmail from "./sendNewAssignedTaskEmail";
import { UpdateBlockEndpoint } from "./types";
import { updateBlockJoiSchema } from "./validation";

const updateBlock: UpdateBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data, updateBlockJoiSchema);
    const updateData = data.data;
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    canReadBlock({ user, block });

    const parent = updateData.parent;
    delete updateData.parent;

    const updatesToSave: Partial<IBlock> = {
        ...updateData,
        updatedAt: getDate(),
        updatedBy: user.customId,
    };

    if (updateData.name && block.type !== BlockType.Task) {
        updatesToSave.lowerCasedName = updateData.name.toLowerCase();
    }

    await context.block.updateBlockById(context, data.blockId, updatesToSave);

    fireAndForgetPromise(
        broadcastBlockUpdate(context, instData, data.blockId, {
            isUpdate: true,
        })
    );

    // TODO: should we wait for these to complete, cause a user can reload while they're pending
    //   and get incomplete/incorrect data
    fireAndForgetPromise(
        processBoardStatusChanges(context, instData, block, user)
    );
    fireAndForgetPromise(processBoardLabelChanges(context, instData, block));
    fireAndForgetPromise(sendNewlyAssignedTaskEmail(context, instData, block));

    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Update,
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        change: {
            oldValue: pick(block, Object.keys(data.data)),
            newValue: data.data,
            customId: getNewId(),
        },

        // TODO: write a script to add orgId to existing update block audit logs without one
        // it was omitted prior
        organizationId: getBlockRootBlockId(block),
    });

    if (parent && block.parent !== parent) {
        await context.transferBlock(context, {
            ...instData,
            data: {
                destinationBlockId: parent,
                draggedBlockId: block.customId,
            },
        });
    }
};

export default updateBlock;
