import {
    IAccessControlPermission,
    IAccessControlRole,
} from "../../mongo/access-control/definitions";
import { ConvertDatesToStrings } from "../../utilities/types";

export type IPublicRoleData = ConvertDatesToStrings<IAccessControlRole>;
export type IPublicPermissionData = ConvertDatesToStrings<IAccessControlPermission>;
