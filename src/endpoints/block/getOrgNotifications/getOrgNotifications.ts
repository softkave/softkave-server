import { SystemActionType, SystemResourceType } from "../../../models/system";
import { assertBlock } from "../../../mongo/block/utils";
import { indexArray } from "../../../utilities/fns";
import { validate } from "../../../utilities/joiUtils";
import {
    getPublicCollaborationRequestArray,
    getPublicNotificationsArray,
} from "../../notifications/utils";
import { getBlockRootBlockId } from "../utils";
import { GetBlockNotificationsEndpoint } from "./types";
import { getBlockCollaborationRequestsJoiSchema } from "./validation";

const getOrgNotifications: GetBlockNotificationsEndpoint = async (
    context,
    instData
) => {
    const data = validate(
        instData.data,
        getBlockCollaborationRequestsJoiSchema
    );
    const user = await context.session.getUser(context, instData);
    const org = await context.block.getBlockById(context, data.blockId);

    assertBlock(org);

    const permissions = await context.accessControl.queryPermissions(
        context,
        [
            {
                orgId: getBlockRootBlockId(org),
                resourceType: SystemResourceType.Notification,
                action: SystemActionType.Read,
                permissionResourceId: org.permissionResourceId,
            },
            {
                orgId: getBlockRootBlockId(org),
                resourceType: SystemResourceType.CollaborationRequest,
                action: SystemActionType.Read,
                permissionResourceId: org.permissionResourceId,
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
        requests = await context.collaborationRequest.getCollaborationRequestsByBlockId(
            context,
            org.customId
        );
    }

    if (shouldLoadNotifications) {
        notifications = await context.notification.getNotificationsByOrgId(
            context,
            org.customId
        );
    }

    return {
        notifications: getPublicNotificationsArray(notifications),
        requests: getPublicCollaborationRequestArray(requests),
    };
};

export default getOrgNotifications;
