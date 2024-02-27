import {IPermissionGroup} from '../../mongo/access-control/permissionGroup';
import {IPermissionItem} from '../../mongo/access-control/permissionItem';
import {IEavAssignedPermissionGroupValue} from '../../mongo/eav/eav';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicPermissionGroup = ConvertDatesToStrings<IPermissionGroup>;
export type IPublicPermissionItem = ConvertDatesToStrings<IPermissionItem>;
export type IPermissionGroupWithAssignedInfo = IPublicPermissionGroup &
  Pick<IEavAssignedPermissionGroupValue, 'assignedAt' | 'assignedBy' | 'order'>;
