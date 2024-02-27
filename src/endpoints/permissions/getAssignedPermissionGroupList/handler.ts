import {pick} from 'lodash';
import {SystemResourceType} from '../../../models/system';
import {IPermissionItem} from '../../../mongo/access-control/permissionItem';
import {ServerError} from '../../../utilities/errors';
import {indexArray} from '../../../utilities/fns';
import {validate} from '../../../utilities/joiUtils';
import {getCollaboratorDataFromUser} from '../../collaborators/utils';
import {getCheckAuthorizationChecker} from '../../contexts/authorization-checks/checkAuthorizaton';
import {assertUser} from '../../user/utils';
import {getAssignPermissionPermQueries} from '../permissionQueries';
import {IPermissionGroupWithAssignedInfo} from '../types';
import {
  assertPermissionGroup,
  getAssignedPermissionGroups,
  isFetchingOwnAssignedPermissionGroups,
} from '../utils';
import {GetAssignedPermissionGroupListEndpoint} from './types';
import {getAssignedPermissionGroupListJoiSchema} from './validation';

export const getAssignedPermissionGroupListEndpoint: GetAssignedPermissionGroupListEndpoint =
  async (ctx, d) => {
    const data = validate(d.data, getAssignedPermissionGroupListJoiSchema);
    const user = await ctx.session.getUser(ctx, d, /** allowAnonymousUsers */ true);
    let permissionItem: IPermissionItem | null = null;

    // TODO: test this flow and similar permission endpoint flows like it
    if (!isFetchingOwnAssignedPermissionGroups(data.entity, user.customId)) {
      if (data.entity.entityType === SystemResourceType.PermissionGroup) {
        const pg = await ctx.data.permissionGroup.getOneByQuery(ctx, {
          customId: data.entity.entityId,
        });
        assertPermissionGroup(pg);
        const accessChecker = await getCheckAuthorizationChecker({
          ctx,
          user,
          orgId: data.organizationId,
          actionTarget: pg,
          ...getAssignPermissionPermQueries(data.organizationId, data.container),
        });
      } else {
        const entityUser = await ctx.data.user.getOneByQuery(ctx, {customId: data.entity.entityId});
        assertUser(entityUser);
        const collaborator = getCollaboratorDataFromUser(entityUser);
        const accessChecker = await getCheckAuthorizationChecker({
          ctx,
          user,
          orgId: data.organizationId,
          actionTarget: collaborator,
          ...getAssignPermissionPermQueries(data.organizationId, data.container),
        });
      }
    }

    const {permissionGroupList, eavMatchList} = await getAssignedPermissionGroups(
      ctx,
      data.organizationId,
      data.entity
    );
    const eavMap = indexArray(eavMatchList, {indexer: item => item.value.permissionGroupId});
    const assignedPermissionGroupList: IPermissionGroupWithAssignedInfo[] = permissionGroupList.map(
      item => {
        const eavItem = eavMap[item.customId];
        if (!eavItem) throw new ServerError();

        const assignedInfo = pick(eavItem.value, 'assignedAt', 'assignedBy', 'order');
        const assignedPermissionGroup: IPermissionGroupWithAssignedInfo = {
          ...item,
          ...assignedInfo,
        };
        return assignedPermissionGroup;
      }
    );

    return {permissionGroups: assignedPermissionGroupList};
  };
