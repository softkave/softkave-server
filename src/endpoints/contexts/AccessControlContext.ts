import { FilterQuery } from "mongoose";
import { SystemActionType, SystemResourceType } from "../../models/system";
import {
    DefaultPermissionGroupNames,
    IPermission,
    IPermissionGroup,
    IUserAssignedPermissionGroup,
} from "../../mongo/access-control/definitions";
import { IUser } from "../../mongo/user";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { IUpdateItemById } from "../../utilities/types";
import { PermissionDeniedError } from "../errors";
import { GetMongoUpdateType } from "../types";
import { wrapFireAndThrowErrorAsync } from "../utils";
import { IBaseContext } from "./IBaseContext";

interface IPermissionQuery {
    organizationId: string;
    permissionResourceId: string;
    resourceType: SystemResourceType;
    action: SystemActionType;
}

export interface IAccessControlContext {
    // Permission groups
    getPermissionGroupsById: (
        ctx: IBaseContext,
        permissionGroupIds: string[]
    ) => Promise<IPermissionGroup[]>;
    getPermissionGroupsByResourceId: (
        ctx: IBaseContext,
        resourceId: string
    ) => Promise<IPermissionGroup[]>;
    getPermissionGroupsByLowerCasedNames: (
        ctx: IBaseContext,
        resourceIds: string[],
        lowerCasedNames: string[]
    ) => Promise<IPermissionGroup[]>;
    savePermissionGroups: (
        ctx: IBaseContext,
        permissionGroups: IPermissionGroup[]
    ) => Promise<IPermissionGroup[]>;
    updatePermissionGroup: (
        ctx: IBaseContext,
        permissionGroupId: string,
        update: Partial<GetMongoUpdateType<IPermissionGroup>>
    ) => Promise<IPermissionGroup | undefined>;
    deletePermissionGroups: (
        ctx: IBaseContext,
        permissionGroupIds: string[]
    ) => Promise<void>;
    permissionGroupExists: (
        ctx: IBaseContext,
        name: string,
        resourceId: string
    ) => Promise<boolean>;
    bulkUpdatePermissionGroupsById: (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<IPermissionGroup>>
    ) => Promise<void>;

    // Permissions
    getResourcePermissions: (
        ctx: IBaseContext,
        resourceId: string
    ) => Promise<IPermission[]>;
    queryPermission: (
        ctx: IBaseContext,
        query: IPermissionQuery,
        user?: IUser
    ) => Promise<IPermission | undefined>;
    queryPermissions: (
        ctx: IBaseContext,
        queries: IPermissionQuery[],
        user?: IUser
    ) => Promise<IPermission[]>;
    assertPermission: (
        ctx: IBaseContext,
        query: IPermissionQuery,
        user?: IUser
    ) => Promise<boolean>;
    assertPermissions: (
        ctx: IBaseContext,
        queries: IPermissionQuery[],
        user?: IUser
    ) => Promise<boolean>;
    savePermissions: (
        ctx: IBaseContext,
        permissions: IPermission[]
    ) => Promise<IPermission[]>;
    updatePermission: (
        ctx: IBaseContext,
        permissionId: string,
        data: Partial<GetMongoUpdateType<IPermission>>
    ) => Promise<IPermission | undefined>;
    deletePermissions: (
        ctx: IBaseContext,
        permissionIds: string[]
    ) => Promise<void>;
    getPermissionsByResourceId: (
        ctx: IBaseContext,
        resourceId: string,
        fullAccess: boolean
    ) => Promise<IPermission[]>;
    bulkUpdatePermissionsById: (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<IPermission>>
    ) => Promise<void>;

    // User-assigned permission groups
    saveUserAssignedPermissionGroup: (
        ctx: IBaseContext,
        userAssignedPermissionGroups: IUserAssignedPermissionGroup[]
    ) => Promise<IUserAssignedPermissionGroup[]>;
    deleteUserAssignedPermissionGroupsByPermissionGroupId: (
        ctx: IBaseContext,
        permissionGroupIds: string[]
    ) => Promise<void>;
    deleteUserAssignedPermissionGroupsByUserAndPermissionGroupIds: (
        ctx: IBaseContext,
        qs: Array<{ userIds: string[]; permissionGroupId: string }>
    ) => Promise<void>;
    getUserAssignedPermissionGroups: (
        ctx: IBaseContext,
        userId: string,
        resourceId?: string
    ) => Promise<IUserAssignedPermissionGroup[]>;
}

export default class AccessControlContext implements IAccessControlContext {
    public static preparePermissionsQuery = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, qs: IPermissionQuery[], user?: IUser) => {
            const userAssignedPermissionGroups: Record<string, string[]> = {};
            const queries: Array<FilterQuery<IPermission>> = [];

            for (const q of qs) {
                const baseQuery: FilterQuery<IPermission> = {
                    permissionOwnerId: q.permissionResourceId,
                    resourceType: q.resourceType,
                    action: q.action,
                    available: true,
                };

                let permissionGroupIds: string[] = [];

                if (user) {
                    permissionGroupIds =
                        userAssignedPermissionGroups[q.permissionResourceId] ||
                        (
                            await ctx.accessControl.getUserAssignedPermissionGroups(
                                ctx,
                                user.customId,
                                q.permissionResourceId
                            )
                        ).map((d) => d.permissionGroupId);

                    userAssignedPermissionGroups[q.permissionResourceId] =
                        permissionGroupIds;
                }

                permissionGroupIds.push(DefaultPermissionGroupNames.Public);
                queries.push({
                    ...baseQuery,
                    permissionGroups: { $in: permissionGroupIds },
                });
            }

            const query: FilterQuery<IPermission> = {
                $or: queries,
            };

            return query;
        }
    );

    public getPermissionGroupsById = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, permissionGroupIds: string[]) => {
            return ctx.models.permissionGroup.model
                .find({
                    customId: { $in: permissionGroupIds },
                })
                .lean()
                .exec();
        }
    );

    public getPermissionGroupsByResourceId = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, resourceId: string) => {
            return ctx.models.permissionGroup.model
                .find({ resourceId })
                .lean()
                .exec();
        }
    );

    public getPermissionGroupsByLowerCasedNames = wrapFireAndThrowErrorAsync(
        (
            ctx: IBaseContext,
            resourceIds: string[],
            lowerCasedNames: string[]
        ) => {
            return ctx.models.permissionGroup.model
                .find({
                    resourceId: { $in: resourceIds },
                    lowerCasedName: { $in: lowerCasedNames },
                })
                .lean()
                .exec();
        }
    );

    public savePermissionGroups = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, permissionGroups: IPermissionGroup[]) => {
            return ctx.models.permissionGroup.model.insertMany(
                permissionGroups
            );
        }
    );

    public updatePermissionGroup = wrapFireAndThrowErrorAsync(
        (
            ctx: IBaseContext,
            permissionGroupId: string,
            update: Partial<GetMongoUpdateType<IPermissionGroup>>
        ) => {
            return ctx.models.permissionGroup.model
                .findOneAndUpdate({ customId: permissionGroupId }, update, {
                    new: true,
                })
                .lean()
                .exec();
        }
    );

    public deletePermissionGroups = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, permissionGroupIds: string[]) => {
            await ctx.models.permissionGroup.model
                .deleteMany({ customId: { $in: permissionGroupIds } })
                .exec();
        }
    );

    public permissionGroupExists = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, name: string, resourceId: string) => {
            return ctx.models.permissionGroup.model.exists({
                name,
                resourceId,
            });
        }
    );

    public getResourcePermissions = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, resourceId: string) => {
            return ctx.models.permissions.model
                .find({ permissionOwnerId: resourceId })
                .lean()
                .exec();
        }
    );

    public queryPermission = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, query: IPermissionQuery, user?: IUser) => {
            return await ctx.models.permissions.model.findOne(
                AccessControlContext.preparePermissionsQuery(ctx, [query], user)
            );
        }
    );

    public queryPermissions = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            queries: IPermissionQuery[],
            user?: IUser
        ) => {
            return await ctx.models.permissions.model.find(
                AccessControlContext.preparePermissionsQuery(ctx, queries, user)
            );
        }
    );

    public assertPermission = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, query: IPermissionQuery, user?: IUser) => {
            const permission = await ctx.accessControl.queryPermission(
                ctx,
                query,
                user
            );

            if (!permission) {
                throw new PermissionDeniedError();
            }

            return true;
        }
    );

    public assertPermissions = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            queries: IPermissionQuery[],
            user?: IUser
        ) => {
            const permissions = await ctx.accessControl.queryPermissions(
                ctx,
                queries,
                user
            );

            const permissionsMap = permissions.reduce((map, permission) => {
                const m1 =
                    map[permission.resourceType] ||
                    ({} as Record<SystemActionType, Record<string, true>>);

                const m2 =
                    m1[permission.action] || ({} as Record<string, true>);

                m2[permission.permissionOwnerId] = true;
                map[permission.resourceType] = m1;

                return map;
            }, {} as Record<SystemResourceType, Record<SystemActionType, Record<string, true>>>);

            queries.map((q) => {
                if (
                    !((permissionsMap[q.resourceType] || {})[q.action] || {})[
                        q.permissionResourceId
                    ]
                ) {
                    throw new PermissionDeniedError();
                }
            });

            return true;
        }
    );

    public savePermissions = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, permissions: IPermission[]) => {
            return ctx.models.permissions.model.insertMany(permissions);
        }
    );

    public updatePermission = wrapFireAndThrowErrorAsync(
        (
            ctx: IBaseContext,
            permissionId: string,
            data: Partial<GetMongoUpdateType<IPermission>>
        ) => {
            return ctx.models.permissions.model
                .findOneAndUpdate({ customId: permissionId }, data, {
                    new: true,
                })
                .lean()
                .exec();
        }
    );

    public deletePermissions = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, permissionIds: string[]) => {
            await ctx.models.permissions.model
                .deleteMany({ customId: { $in: permissionIds } })
                .exec();
        }
    );

    public getPermissionsByResourceId = wrapFireAndThrowErrorAsync(
        async (ctx: IBaseContext, resourceId: string, fullAccess: boolean) => {
            if (fullAccess) {
                return ctx.models.permissions.model
                    .find({ permissionOwnerId: resourceId })
                    .lean()
                    .exec();
            } else {
                // TODO
                return ctx.models.permissions.model
                    .find({ permissionOwnerId: resourceId })
                    .lean()
                    .exec();
            }
        }
    );

    public bulkUpdatePermissionsById = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: Array<IUpdateItemById<IPermission>>
        ) => {
            const opts = data.map((b) => ({
                updateOne: {
                    filter: { customId: b.id },
                    update: b.data,
                },
            }));

            await ctx.models.sprintModel.model.bulkWrite(opts);
        }
    );

    public bulkUpdatePermissionGroupsById = wrapFireAndThrowErrorAsync(
        async (
            ctx: IBaseContext,
            data: Array<IUpdateItemById<IPermissionGroup>>
        ) => {
            const opts = data.map((b) => ({
                updateOne: {
                    filter: { customId: b.id },
                    update: b.data,
                },
            }));

            await ctx.models.sprintModel.model.bulkWrite(opts);
        }
    );

    saveUserAssignedPermissionGroup = wrapFireAndThrowErrorAsync(
        (
            ctx: IBaseContext,
            userAssignedPermissionGroups: IUserAssignedPermissionGroup[]
        ) => {
            return ctx.models.userAssignedPermissionGroup.model.insertMany(
                userAssignedPermissionGroups
            );
        }
    );

    deleteUserAssignedPermissionGroupsByPermissionGroupId =
        wrapFireAndThrowErrorAsync(
            async (ctx: IBaseContext, permissionGroupIds: string[]) => {
                await ctx.models.userAssignedPermissionGroup.model
                    .deleteMany({
                        permissionGroupId: { $in: permissionGroupIds },
                    })
                    .exec();
            }
        );

    deleteUserAssignedPermissionGroupsByUserAndPermissionGroupIds =
        wrapFireAndThrowErrorAsync(
            async (
                ctx: IBaseContext,
                qs: Array<{ userIds: string[]; permissionGroupId: string }>
            ) => {
                await ctx.models.userAssignedPermissionGroup.model.bulkWrite(
                    qs.map((q) => {
                        return {
                            deleteMany: {
                                filter: {
                                    permissionGroupId: q.permissionGroupId,
                                    userId: { $in: q.userIds },
                                },
                            },
                        };
                    })
                );
            }
        );

    getUserAssignedPermissionGroups = wrapFireAndThrowErrorAsync(
        (ctx: IBaseContext, userId: string, resourceId?: string) => {
            return ctx.models.userAssignedPermissionGroup.model
                .find({ userId, resourceId })
                .lean()
                .exec();
        }
    );
}

export const getAccessControlContext = makeSingletonFn(
    () => new AccessControlContext()
);
