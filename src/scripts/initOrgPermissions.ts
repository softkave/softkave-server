import {
    getDefaultOrganizationPermissionGroups,
    makeDefaultPermissions,
} from "../endpoints/accessControl/initializeBlockPermissions";
import { SystemResourceType } from "../models/system";
import { getPermissionModel } from "../mongo/access-control/PermissionModel";
import { getPermissionGroupsModel } from "../mongo/access-control/PermissionGroupsModel";
import {
    DefaultPermissionGroupNames,
    IUserAssignedPermissionGroup,
} from "../mongo/access-control/definitions";
import { getUserAssignedPermissionGroupsModel } from "../mongo/access-control/UserAssignedPermissionGroupsModel";
import { BlockType, getBlockModel, IBlockDocument } from "../mongo/block";
import { getUserModel } from "../mongo/user";
import { getDateString } from "../utilities/fns";
import {
    logScriptFailed,
    logScriptStarted,
    logScriptSuccessful,
} from "./utils";
import getNewId from "../utilities/getNewId";

export async function script_initOrganizationPermissions() {
    logScriptStarted(script_initOrganizationPermissions);

    const blockModel = getBlockModel();
    const permissionGroupModel = getPermissionGroupsModel();
    const permissionModel = getPermissionModel();
    const userModel = getUserModel();
    const userAssignedPermissionGroupModel =
        getUserAssignedPermissionGroupsModel();

    await blockModel.waitTillReady();
    await permissionGroupModel.waitTillReady();
    await permissionModel.waitTillReady();
    await userModel.waitTillReady();
    await userAssignedPermissionGroupModel.waitTillReady();

    const cursor = blockModel.model
        .find({ type: BlockType.Organization })
        .cursor();
    let docsCount = 0;

    try {
        for (
            let doc: IBlockDocument = await cursor.next();
            doc !== null;
            doc = await cursor.next()
        ) {
            if (doc.permissionResourceId) {
                continue;
            }

            const {
                permissionGroups,
                adminPermissionGroup,
                publicPermissionGroup,
                collaboratorPermissionGroup,
            } = getDefaultOrganizationPermissionGroups(doc.createdBy, doc);

            const permissions = makeDefaultPermissions(doc.createdBy, doc, {
                [DefaultPermissionGroupNames.Admin]: adminPermissionGroup,
                [DefaultPermissionGroupNames.Collaborator]:
                    collaboratorPermissionGroup,
                [DefaultPermissionGroupNames.Public]: publicPermissionGroup,
            });

            await permissionGroupModel.model.insertMany(permissionGroups);
            await permissionModel.model.insertMany(permissions);
            await blockModel.model
                .updateMany(
                    { rootBlockId: doc.customId },
                    { permissionResourceId: doc.customId }
                )
                .exec();

            doc.permissionResourceId = doc.customId;
            doc.publicPermissionGroupId = publicPermissionGroup.customId;
            await doc.save();

            // TODO: make sure to check that this works
            console.log(`organization '${doc.name}', id = '${doc.customId}'`);
            console.log(
                `admin permissionGroup id = '${adminPermissionGroup.customId}`
            );
            console.log(`created by = '${doc.createdBy}`);
            console.log("");

            const users = await userModel.model.find(
                {
                    "organizations.customId": doc.customId,
                },
                { customId: 1 }
            );

            const nowStr = getDateString();
            const userPermissionGroupMaps = users.map((user) => {
                const userPermissionGroupMap: IUserAssignedPermissionGroup = {
                    userId: user.customId,
                    organizationId: doc.customId,
                    resourceId: doc.customId,
                    resourceType: SystemResourceType.Organization,
                    permissionGroupId: collaboratorPermissionGroup.customId,
                    addedAt: nowStr,
                    addedBy: doc.createdBy,
                    customId: getNewId(),
                };

                return userPermissionGroupMap;
            });

            userPermissionGroupMaps.push({
                userId: doc.createdBy,
                organizationId: doc.customId,
                resourceId: doc.customId,
                resourceType: SystemResourceType.Organization,
                permissionGroupId: adminPermissionGroup.customId,
                addedAt: nowStr,
                addedBy: doc.createdBy,
                customId: getNewId(),
            });

            await userAssignedPermissionGroupModel.model.insertMany(
                userPermissionGroupMaps
            );

            docsCount++;
        }

        cursor.close();

        console.log(`organization(s) count = ${docsCount}`);
        logScriptSuccessful(script_initOrganizationPermissions);
    } catch (error) {
        logScriptFailed(script_initOrganizationPermissions, error);
    }
}
