import assert = require('assert');
import {IBaseContext} from '../endpoints/contexts/IBaseContext';
import {INTERNAL_assignPermissionGroups} from '../endpoints/permissions/assignPermissionGroups/handler';
import {setupOrgPermissionGroups} from '../endpoints/permissions/utils';
import {SystemResourceType} from '../models/system';
import {IWorkspace} from '../mongo/block/workspace';
import {EavAttributes} from '../mongo/eav/eav';
import logger from '../utilities/logger';

async function backfillForWorkspace(ctx: IBaseContext, org: IWorkspace) {
  await Promise.all([
    ctx.models.permissionGroup.model.deleteMany({workspaceId: org.customId}),
    ctx.models.permissionItem.model.deleteMany({workspaceId: org.customId}),
    ctx.models.eav.model.deleteMany({
      $or: [
        {workspaceId: org.customId, attribute: EavAttributes.PublicPermissionGroup},
        {workspaceId: org.customId, attribute: EavAttributes.AssignedPermissionGroup},
      ],
    }),
  ]);

  const {memberPg} = await setupOrgPermissionGroups(ctx, org.createdBy, org.customId);
  const collaborators = await ctx.user.getBlockCollaborators(ctx, org.customId);
  await Promise.all(
    collaborators.map(
      c =>
        c.customId !== org.createdBy &&
        INTERNAL_assignPermissionGroups(ctx, org.createdBy, org.customId, [
          {
            entity: {entityId: c.customId, entityType: SystemResourceType.User},
            permissionGroupId: memberPg.customId,
          },
        ])
    )
  );
}

export async function script_backfillWorkspacePermissions(ctx: IBaseContext) {
  logger.info('script: start backfill workspace permissions');
  const orgList = await ctx.models.workspace.model.find({});
  await Promise.all(orgList.map(o => backfillForWorkspace(ctx, o)));
  logger.info('script: end backfill workspace permissions');
}
