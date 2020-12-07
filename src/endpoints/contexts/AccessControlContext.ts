import { ClientSession, FilterQuery } from "mongoose";
import { SystemActionType, SystemResourceType } from "../../models/system";
import {
    AccessControlDefaultRoles,
    IAccessControlPermission,
    IAccessControlRole,
} from "../../mongo/access-control/definitions";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { IUpdateItemById } from "../../utilities/types";
import { PermissionDeniedError } from "../errors";
import { GetMongoUpdateType } from "../types";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

interface IPermissionQuery {
    permissionResourceId: string;
    resourceType: SystemResourceType;
    action: SystemActionType;
}

export interface IAccessControlContext {
    // Roles
    getRolesById: (
        ctx: IBaseContext,
        roleIds: string[]
    ) => Promise<IAccessControlRole[]>;
    getRolesByResourceId: (
        ctx: IBaseContext,
        resourceId: string
    ) => Promise<IAccessControlRole[]>;
    saveRoles: (
        ctx: IBaseContext,
        roles: IAccessControlRole[],
        session?: ClientSession
    ) => Promise<IAccessControlRole[]>;
    updateRole: (
        ctx: IBaseContext,
        roleId: string,
        update: Partial<GetMongoUpdateType<IAccessControlRole>>
    ) => Promise<IAccessControlRole | undefined>;
    deleteRoles: (
        ctx: IBaseContext,
        roleIds: string[],
        session?: ClientSession
    ) => Promise<void>;
    roleExists: (
        ctx: IBaseContext,
        name: string,
        resourceId: string
    ) => Promise<boolean>;
    bulkUpdateRolesById: (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<IAccessControlRole>>,
        session?: ClientSession
    ) => Promise<void>;

    // Permissions
    getResourcePermissions: (
        ctx: IBaseContext,
        resourceId: string
    ) => Promise<IAccessControlPermission[]>;
    queryPermission: (
        ctx: IBaseContext,
        orgId: string,
        query: IPermissionQuery,
        user?: IUser
    ) => Promise<IAccessControlPermission | undefined>;
    queryPermissions: (
        ctx: IBaseContext,
        orgId: string,
        queries: IPermissionQuery[],
        user?: IUser
    ) => Promise<IAccessControlPermission[]>;
    assertPermission: (
        ctx: IBaseContext,
        orgId: string,
        query: IPermissionQuery,
        user?: IUser
    ) => Promise<boolean>;
    assertPermissions: (
        ctx: IBaseContext,
        orgId: string,
        queries: IPermissionQuery[],
        user?: IUser
    ) => Promise<boolean>;
    savePermissions: (
        ctx: IBaseContext,
        permissions: IAccessControlPermission[]
    ) => Promise<IAccessControlPermission[]>;
    updatePermission: (
        ctx: IBaseContext,
        permissionId: string,
        data: Partial<GetMongoUpdateType<IAccessControlPermission>>
    ) => Promise<IAccessControlPermission | undefined>;
    deletePermissions: (
        ctx: IBaseContext,
        permissionIds: string[]
    ) => Promise<void>;
    getPermissionsByResourceId: (
        ctx: IBaseContext,
        resourceId: string
    ) => Promise<IAccessControlPermission[]>;
    bulkUpdatePermissionsById: (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<IAccessControlPermission>>
    ) => Promise<void>;
}

export default class AccessControlContext implements IAccessControlContext {
    public static preparePermissionsQuery(
        orgId: string,
        qs: IPermissionQuery[],
        user?: IUser
    ) {
        const queries = qs.reduce((accumulator, q) => {
            const baseQuery: FilterQuery<IAccessControlPermission> = {
                permissionOwnerId: q.permissionResourceId,
                resourceType: q.resourceType,
                action: q.action,
                available: true,
            };

            let roles: string[] = [AccessControlDefaultRoles.Public];

            if (user) {
                accumulator.push({
                    ...baseQuery,
                    users: user.customId,
                });

                const userOrgData = user.orgs.find(
                    (org) => org.customId === orgId
                );

                if (userOrgData && userOrgData.roles?.length > 0) {
                    roles = roles.concat(userOrgData.roles);
                }
            }

            accumulator.push({
                ...baseQuery,
                roles: { $in: roles },
            });

            return accumulator;
        }, [] as Array<FilterQuery<IAccessControlPermission>>);

        const query: FilterQuery<IAccessControlPermission> = {
            $or: queries,
        };

        return query;
    }
    public getRolesById = wrapFireAndThrowError(
        (ctx: IBaseContext, roleIds: string[]) => {
            return ctx.models.roles.model
                .find({
                    customId: { $in: roleIds },
                })
                .lean()
                .exec();
        }
    );

    public getRolesByResourceId = wrapFireAndThrowError(
        (ctx: IBaseContext, resourceId: string) => {
            return ctx.models.roles.model.find({ resourceId }).lean().exec();
        }
    );

    public saveRoles = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            roles: IAccessControlRole[],
            session?: ClientSession
        ) => {
            return ctx.models.roles.model.insertMany(roles, { session });
        }
    );

    public updateRole = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            roleId: string,
            update: Partial<GetMongoUpdateType<IAccessControlRole>>
        ) => {
            return ctx.models.roles.model
                .findOneAndUpdate({ customId: roleId }, update, { new: true })
                .lean()
                .exec();
        }
    );

    public deleteRoles = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            roleIds: string[],
            session?: ClientSession
        ) => {
            await ctx.models.roles.model
                .deleteMany({ customId: { $in: roleIds } }, { session })
                .exec();
        }
    );

    public roleExists = wrapFireAndThrowError(
        (ctx: IBaseContext, name: string, resourceId: string) => {
            return ctx.models.roles.model.exists({
                name,
                resourceId,
            });
        }
    );

    public getResourcePermissions = wrapFireAndThrowError(
        (ctx: IBaseContext, resourceId: string) => {
            return ctx.models.permissions.model
                .find({ permissionOwnerId: resourceId })
                .lean()
                .exec();
        }
    );

    public queryPermission = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            query: IPermissionQuery,
            user?: IUser
        ) => {
            return await ctx.models.permissions.model.findOne(
                AccessControlContext.preparePermissionsQuery(
                    orgId,
                    [query],
                    user
                )
            );
        }
    );

    public queryPermissions = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            queries: IPermissionQuery[],
            user?: IUser
        ) => {
            return await ctx.models.permissions.model.find(
                AccessControlContext.preparePermissionsQuery(
                    orgId,
                    queries,
                    user
                )
            );
        }
    );

    public assertPermission = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            query: IPermissionQuery,
            user?: IUser
        ) => {
            const permission = await ctx.accessControl.queryPermission(
                ctx,
                orgId,
                query,
                user
            );

            if (!permission) {
                throw new PermissionDeniedError();
            }

            return true;
        }
    );

    public assertPermissions = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            queries: IPermissionQuery[],
            user?: IUser
        ) => {
            const permissions = await ctx.accessControl.queryPermissions(
                ctx,
                orgId,
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

    public savePermissions = wrapFireAndThrowError(
        (ctx: IBaseContext, permissions: IAccessControlPermission[]) => {
            return ctx.models.permissions.model.insertMany(permissions);
        }
    );

    public updatePermission = wrapFireAndThrowError(
        (
            ctx: IBaseContext,
            permissionId: string,
            data: Partial<GetMongoUpdateType<IAccessControlPermission>>
        ) => {
            return ctx.models.permissions.model
                .findOneAndUpdate({ customId: permissionId }, data, {
                    new: true,
                })
                .lean()
                .exec();
        }
    );

    public deletePermissions = wrapFireAndThrowError(
        async (ctx: IBaseContext, permissionIds: string[]) => {
            await ctx.models.permissions.model
                .deleteMany({ customId: { $in: permissionIds } })
                .exec();
        }
    );

    public getPermissionsByResourceId = wrapFireAndThrowError(
        (ctx: IBaseContext, resourceId: string) => {
            return ctx.models.permissions.model
                .find({ permissionOwnerId: resourceId })
                .lean()
                .exec();
        }
    );

    public bulkUpdatePermissionsById = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            data: Array<IUpdateItemById<IAccessControlPermission>>
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

    public bulkUpdateRolesById = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            data: Array<IUpdateItemById<IAccessControlRole>>,
            session?: ClientSession
        ) => {
            const opts = data.map((b) => ({
                updateOne: {
                    filter: { customId: b.id },
                    update: b.data,
                },
            }));

            await ctx.models.sprintModel.model.bulkWrite(opts, { session });
        }
    );
}

export const getAccessControlContext = makeSingletonFunc(
    () => new AccessControlContext()
);
