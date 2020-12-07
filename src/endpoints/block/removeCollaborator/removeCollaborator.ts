import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { validate } from "../../../utilities/joiUtils";
import { getCollaboratorRemovedNotification } from "../../notifications/templates/collaborator";
import { UserDoesNotExistError } from "../../user/errors";
import { fireAndForgetPromise } from "../../utils";
import { getBlockRootBlockId } from "../utils";
import { RemoveCollaboratorEndpoint } from "./types";
import { removeCollaboratorJoiSchema } from "./validation";

const removeCollaborator: RemoveCollaboratorEndpoint = async (
    context,
    instData
) => {
    const data = validate(instData.data, removeCollaboratorJoiSchema);
    const user = await context.session.getUser(context, instData);
    const org = await context.block.getBlockById(context, data.blockId);

    assertBlock(org);
    await context.accessControl.assertPermission(
        context,
        getBlockRootBlockId(org),
        {
            resourceType: SystemResourceType.Collaborator,
            action: SystemActionType.Delete,
            permissionResourceId: org.permissionResourceId,
        },
        user
    );

    const collaborator = await context.user.getUserById(
        context,
        data.collaboratorId
    );

    if (!collaborator) {
        throw new UserDoesNotExistError();
    }

    const collaboratorOrgs = [...collaborator.orgs];
    const index = collaboratorOrgs.findIndex((o) => o.customId === o.customId);

    if (index === -1) {
        return;
    }

    collaboratorOrgs.splice(index, 1);
    await context.user.updateUserById(context, collaborator.customId, {
        orgs: collaboratorOrgs,
    });

    const notification = getCollaboratorRemovedNotification(
        org,
        collaborator,
        user
    );

    fireAndForgetPromise(
        context.notification.bulkSaveNotifications(context, [notification])
    );
};

export default removeCollaborator;
