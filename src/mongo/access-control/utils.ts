import forEach from "lodash/forEach";
import { SystemActionType, SystemResourceType } from "../../models/system";
import {
    IPermissionLikeObject,
    IResourceTypeToActionsMap,
    resourceTypesToActionsMap,
} from "./definitions";

// Maps permissions array to by resource type and action type
export function getPermissions2DimensionalMap<T extends IPermissionLikeObject>(
    permissions: T[]
) {
    const result = permissions.reduce((map, permission) => {
        const actions = map[permission.resourceType] || ({} as any);

        actions[permission.action] = permission;
        map[permission.resourceType] = actions;

        return map;
    }, {} as Record<SystemResourceType, Record<SystemActionType, T>>);

    return result;
}

export function getPermissionsListFromResourceTypeToActionsMap(
    map: IResourceTypeToActionsMap
) {
    const permissions: IPermissionLikeObject[] = [];

    forEach(map, (actions, resourceType) => {
        forEach(actions, (action) => {
            permissions.push({
                action,
                resourceType: resourceType as SystemResourceType,
            });
        });
    });

    return permissions;
}

export function getResourceTypeToActionsMapByResourceTypeList(
    resourceTypes: SystemResourceType[]
) {
    const map = resourceTypes.reduce((accumulator, resourceType) => {
        accumulator[resourceType] = resourceTypesToActionsMap[resourceType];
        return accumulator;
    }, {} as IResourceTypeToActionsMap);

    return map;
}

export function findPermissionsInBNotInA<
    Type1 extends IPermissionLikeObject,
    Type2 extends IPermissionLikeObject
>(pA: Type1[], pB: Type2[]): Type2[] {
    const paMap = getPermissions2DimensionalMap(pA);
    const permissionsNotFound = pB.filter((p) => {
        const actionsMap = paMap[p.resourceType];

        if (!actionsMap) {
            return true;
        }

        const actionExists = actionsMap[p.action];

        if (!actionExists) {
            return true;
        }

        return false;
    });

    return permissionsNotFound;
}
