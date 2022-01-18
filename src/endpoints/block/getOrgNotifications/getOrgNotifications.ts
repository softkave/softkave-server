import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import { getBlockRootBlockId } from "../utils";
import { GetBlockNotificationsEndpoint } from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

const getOrganizationNotifications: GetBlockNotificationsEndpoint = async (
    context,
    instData
) => {
    const data = validate(
        instData.data,
        getBlockCollaborationRequestsJoiSchema
    );
    const user = await context.session.getUser(context, instData);
    const organization = await context.block.getBlockById(
        context,
        data.blockId
    );

    assertBlock(organization);

    const permissions = await context.accessControl.queryPermissions(
        context,
        [
            {
                organizationId: getBlockRootBlockId(organization),
                resourceType: SystemResourceType.Notification,
                action: SystemActionType.Read,
                permissionResourceId: organization.permissionResourceId,
            },
            {
                organizationId: getBlockRootBlockId(organization),
                resourceType: SystemResourceType.CollaborationRequest,
                action: SystemActionType.Read,
                permissionResourceId: organization.permissionResourceId,
            },
        ],
        user
    );

    const permissionsMap = indexArray(permissions, { path: "resourceType" });
    const shouldLoadNotifications =
        permissionsMap[SystemResourceType.Notification];
    const shouldLoadRequests =
        permissionsMap[SystemResourceType.CollaborationRequest];

    let requests = [];
    let notifications = [];

    if (shouldLoadRequests) {
        requests =
            await context.collaborationRequest.getCollaborationRequestsByBlockId(
                context,
                organization.customId
            );
    }

    if (shouldLoadNotifications) {
        notifications =
            await context.notification.getNotificationsByOrganizationId(
                context,
                organization.customId
            );
    }

    return {
        notifications: [],
        requests: [],
    };
};

export default getOrganizationNotifications;
