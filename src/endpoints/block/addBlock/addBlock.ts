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

    if (newBlock.type === BlockType.Organization) {
        const organizationSaveResult = await context.addBlock(context, {
            ...instData,
            data,
        });

        const organization = organizationSaveResult.block;

        // TODO: scrub for organizations that are not added to user and add or clean them
        //    you can do this when user tries to read them, or add them again
        // TODO: scrub all data that failed it's pipeline

        const userOrganizations = user.organizations.concat({
            customId: organization.customId,
        });
        user = await context.user.updateUserById(context, user.customId, {
            organizations: userOrganizations,
        });

        instData.user = user;

        context.broadcastHelpers.broadcastBlockUpdate(context, instData, {
            updateType: { isNew: true },
            data: organization,
            block: organization,
            blockId: organization.customId,
            blockType: organization.type,
        });

        return {
            block: getPublicBlockData(organization),
        };
    }

    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: newBlock.rootBlockId!,
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
