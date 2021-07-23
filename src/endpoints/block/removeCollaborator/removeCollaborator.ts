import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getCollaboratorRemovedNotification } from "../../notifications/templates/collaborator";
import { UserDoesNotExistError } from "../../user/errors";
import { fireAndForgetPromise } from "../../utils";
import canReadBlock from "../canReadBlock";
import { getBlockRootBlockId } from "../utils";
import { RemoveCollaboratorEndpoint } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

const removeCollaborator: RemoveCollaboratorEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, removeCollaboratorJoiSchema);
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.getBlockById(
        context,
        data.blockId
    );

    assertBlock(organization);
    // await context.accessControl.assertPermission(
    //     context,
    //     {
    //         organizationId: getBlockRootBlockId(organization),
    //         resourceType: SystemResourceType.Collaborator,
    //         action: SystemActionType.Delete,
    //         permissionResourceId: organization.permissionResourceId,
    //     },
    //     user
    // );

    canReadBlock({ user, block: organization });

    const collaborator = await context.user.getUserById(
        context,
        data.collaboratorId
    );

    if (!collaborator) {
        throw new UserDoesNotExistError();
    }

    const collaboratorOrganizations = [...collaborator.organizations];
    const index = collaboratorOrganizations.findIndex(
        (o) => o.customId === o.customId
    );

    if (index === -1) {
        return;
    }

    collaboratorOrganizations.splice(index, 1);
    await context.user.updateUserById(context, collaborator.customId, {
        organizations: collaboratorOrganizations,
    });

    // const notification = getCollaboratorRemovedNotification(
    //     organization,
    //     collaborator,
    //     user
    // );

    // fireAndForganizationetPromise(
    //     context.notification.bulkSaveNotifications(context, [notification])
    // );
};

export default removeCollaborator;
