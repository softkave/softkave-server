import {
    IPermission,
    IPermissionGroup,
    IUserAssignedPermissionGroup,
} from "../../mongo/access-control/definitions";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicPermissionGroup = ConvertDatesToStrings<IPermissionGroup>;
export type IPublicPermission = ConvertDatesToStrings<IPermission>;
export type IPublicUserAssignedPermissionGroup = IUserAssignedPermissionGroup;
