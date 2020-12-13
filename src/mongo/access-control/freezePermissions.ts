import { resourceTypesToActionsMap } from "./definitions";
import { IFreezedPermissionsModel } from "./FreezedPermissionModel";
import { getPermissionsListFromResourceTypeToActionsMap } from "./utils";

// Deletes and replaces freezed permissions
export async function freezeCurrentPermissions(
    model: IFreezedPermissionsModel
) {
    const resourceTypeToActionList = getPermissionsListFromResourceTypeToActionsMap(
        resourceTypesToActionsMap
    );

    // delete everything
    await model.model.deleteMany({}).exec();
    await model.model.insertMany(resourceTypeToActionList);
}
