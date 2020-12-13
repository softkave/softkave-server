import { resourceTypesToActionsMap } from "./definitions";
import { IFreezedPermissionsModel } from "./FreezedPermissionModel";
import {
    findPermissionsInBNotInA,
    getPermissionsListFromResourceTypeToActionsMap,
} from "./utils";

// TODO:
// get freezed permissions
// get all permissions
// compare and get new permissions
// send notification to block permission managers if new permissions
// initialize permissions if new permissions
// freeze new permissions

export async function getNewPermissions(model: IFreezedPermissionsModel) {
    const freezedPermissions = await model.model.find({}).lean().exec();
    const resourceTypeToActionList = getPermissionsListFromResourceTypeToActionsMap(
        resourceTypesToActionsMap
    );

    const newPermissions = findPermissionsInBNotInA(
        resourceTypeToActionList,
        freezedPermissions
    );

    return newPermissions;
}
