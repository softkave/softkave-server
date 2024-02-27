import {SystemResourceType} from '../../../../models/system';
import {getNewId02} from '../../../../utilities/ids';
import {getTestBaseContext} from '../../../testUtils/contexts/TestBaseContext';
import {seedRandomPermissions} from '../../../testUtils/data/permissions';

const ctx = getTestBaseContext();

afterAll(async () => {
  await ctx.close();
});

describe('PermissionMongoDataProvider', () => {
  test('insertList', async () => {
    const orgId = getNewId02(SystemResourceType.Workspace);
    await ctx.data.permissionItem.insertList(ctx, seedRandomPermissions(5, {workspaceId: orgId}));
    const count = await ctx.models.permissionItem.model.countDocuments({workspaceId: orgId}).exec();
    expect(count).toBe(5);
  });

  test('getManyByQueries', async () => {
    const orgId = getNewId02(SystemResourceType.Workspace);
    const boardId = getNewId02(SystemResourceType.Board);
    await ctx.models.permissionItem.model.insertMany(
      seedRandomPermissions(5, {
        target: {
          targetId: orgId,
          targetType: SystemResourceType.Workspace,
          containerId: orgId,
          containerType: SystemResourceType.Workspace,
        },
        workspaceId: orgId,
      }).concat(
        seedRandomPermissions(5, {
          target: {
            targetId: boardId,
            targetType: SystemResourceType.Board,
            containerId: orgId,
            containerType: SystemResourceType.Workspace,
          },
          workspaceId: orgId,
        })
      )
    );
    const items = await ctx.data.permissionItem.getManyByQueries(ctx, [
      {
        target: {
          $objMatch: {
            targetId: orgId,
            targetType: SystemResourceType.Workspace,
            containerId: orgId,
            containerType: SystemResourceType.Workspace,
          },
        },
        workspaceId: orgId,
      },
      {
        target: {
          $objMatch: {
            targetId: boardId,
            targetType: SystemResourceType.Board,
            containerId: orgId,
            containerType: SystemResourceType.Workspace,
          },
        },
        workspaceId: orgId,
      },
    ]);
    expect(items.length).toBe(10);
  });

  test('$in test', async () => {
    const orgId = getNewId02(SystemResourceType.Workspace);
    const boardId = getNewId02(SystemResourceType.Board);
    await ctx.models.permissionItem.model.insertMany(
      seedRandomPermissions(5, {
        target: {
          targetId: orgId,
          targetType: SystemResourceType.Workspace,
          containerId: orgId,
          containerType: SystemResourceType.Workspace,
        },
        workspaceId: orgId,
      }).concat(
        seedRandomPermissions(5, {
          target: {
            targetId: boardId,
            targetType: SystemResourceType.Board,
            containerId: orgId,
            containerType: SystemResourceType.Workspace,
          },
          workspaceId: orgId,
        })
      )
    );
    const items = await ctx.data.permissionItem.getManyByQueries(ctx, [
      {target: {$objMatch: {targetId: {$in: [orgId, boardId]}}}, workspaceId: orgId},
    ]);
    expect(items.length).toBe(10);
  });
});
