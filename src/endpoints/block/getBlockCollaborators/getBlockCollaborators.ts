import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getCollaboratorsArray } from "../../user/utils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import { GetBlockCollaboratorsEndpoint } from "./types";
import { getBlockCollaboratorsJoiSchema } from "./validation";

const getBlockCollaborators: GetBlockCollaboratorsEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, getBlockCollaboratorsJoiSchema);
    const user = await context.session.getUser(context, instData);
    const block = await context.block.getBlockById(context, data.blockId);

    assertBlock(block);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(block),
    //         resourceType: SystemResourceType.Collaborator,
    //         action: SystemActionType.Read,
    //         permissionResourceId: block.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block });

    const collaborators = await context.user.getBlockCollaborators(
        context,
        block.customId
    );

    return {
        collaborators: getCollaboratorsArray(collaborators),
    };
};

export default getBlockCollaborators;
