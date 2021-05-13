import { SystemActionType, SystemResourceType } from "../../../models/system";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId, getPublicBlockData } from "../utils";
import { AddBlockEndpoint } from "./types";
import { addBlockJoiSchema } from "./validation";

const addBlock: AddBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data, addBlockJoiSchema);
    const newBlock = data.block;
    let user = await context.session.getUser(context, instData);

    if (newBlock.type === BlockType.Org) {
        const orgSaveResult = await context.addBlock(context, {
            ...instData,
            data,
        });

        const org = orgSaveResult.block;

        // TODO: scrub for orgs that are not added to user and add or clean them
        //    you can do this when user tries to read them, or add them again
        // TODO: scrub all data that failed it's pipeline

        const userOrgs = user.orgs.concat({ customId: org.customId });
        user = await context.user.updateUserById(context, user.customId, {
            orgs: userOrgs,
        });

        instData.user = user;
        context.auditLog.insert(context, instData, {
            action: SystemActionType.Create,
            resourceId: org.customId,
            resourceType: SystemResourceType.Org,
            organizationId: org.customId,
        });

        context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
            updateType: { isNew: true },
            data: org,
            block: org,
            blockId: org.customId,
            blockType: org.type,
        });

        return {
            block: getPublicBlockData(org),
        };
    }

    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         orgId: newBlock.rootBlockId!,
    //         resourceType:
    //             newBlock.type === BlockType.Board
    //                 ? SystemResourceType.Board
    //                 : SystemResourceType.Task,
    //         action: SystemActionType.Create,
    //         permissionResourceId: newBlock.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: newBlock });

    const result = await context.addBlock(context, {
        ...instData,
        data,
    });

    const block = result.block;

    context.auditLog.insert(context, instData, {
        action: SystemActionType.Create,
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        organizationId: getBlockRootBlockId(block),
    });

    context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
        block,
        updateType: { isNew: true },
        data: block,
        blockId: block.customId,
        blockType: block.type,
        parentId: block.parent,
    });

    // TODO: analyze all the net calls you're making and look for ways to reduce them

    return {
        block: getPublicBlockData(block),
    };
};

export default addBlock;
