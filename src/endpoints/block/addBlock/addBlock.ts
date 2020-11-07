import {
    AuditLogActionType,
    AuditLogResourceType,
} from "../../../mongo/audit-log";
import { getBlockAuditLogResourceType } from "../../../mongo/audit-log/utils";
import { BlockType } from "../../../mongo/block";
import { validate } from "../../../utilities/joiUtils";
import { fireAndForgetPromise } from "../../utils";
import broadcastBlockUpdate from "../broadcastBlockUpdate";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId, getPublicBlockData } from "../utils";
import { AddBlockEndpoint } from "./types";
import { newBlockJoiSchema } from "./validation";

const addBlock: AddBlockEndpoint = async (context, instData) => {
    const data = validate(instData.data.block, newBlockJoiSchema);
    const newBlock = data;
    const user = await context.session.getUser(context, instData);

    if (newBlock.type === BlockType.Org) {
        const orgSaveResult = await context.addBlock(context, {
            ...instData,
            data: { block: data },
        });

        const org = orgSaveResult.block;

        // TODO: scrub for orgs that are not added to user and add or clean them
        //    you can do this when user tries to read them, or add them again
        // TODO: scrub all data that failed it's pipeline

        const userOrgs = user.orgs.concat({ customId: org.customId });
        await context.session.updateUser(context, instData, {
            orgs: userOrgs,
        });

        context.auditLog.insert(context, instData, {
            action: AuditLogActionType.Create,
            resourceId: org.customId,
            resourceType: AuditLogResourceType.Org,
            organizationId: org.customId,
        });

        fireAndForgetPromise(
            broadcastBlockUpdate({
                context,
                instData,
                updateType: { isNew: true },
                data: org,
                block: org,
                blockId: org.customId,
                blockType: org.type,
            })
        );

        return {
            block: getPublicBlockData(org),
        };
    }

    const rootParent = await context.block.getBlockById(
        context,
        newBlock.rootBlockId
    );

    await canReadBlock({ user, block: rootParent });

    const result = await context.addBlock(context, {
        ...instData,
        data: { block: data },
    });

    const block = result.block;

    context.auditLog.insert(context, instData, {
        action: AuditLogActionType.Create,
        resourceId: block.customId,
        resourceType: getBlockAuditLogResourceType(block),
        organizationId: getBlockRootBlockId(block),
    });

    fireAndForgetPromise(
        broadcastBlockUpdate({
            block,
            context,
            instData,
            updateType: { isNew: true },
            data: block,
            blockId: block.customId,
            blockType: block.type,
            parentId: block.parent,
        })
    );

    // TODO: analyze all the net calls you're making and look for ways to reduce them

    return {
        block: getPublicBlockData(block),
    };
};

export default addBlock;
