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
    resourceId: string;
    resourceType: SystemResourceType;
    action: SystemActionType;
}

export interface IAccessControlContext {
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
    getResourcePermissions: (
        ctx: IBaseContext,
        resourceId: string
    ) => Promise<IAccessControlPermission[]>;
    queryPermission: (
        ctx: IBaseContext,
        orgId: string,
        query: IPermissionQuery,
        user?: IUser
    ) => Promise<boolean>;
    queryPermissions: (
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
    bulkUpdateRolesById: (
        ctx: IBaseContext,
        data: Array<IUpdateItemById<IAccessControlRole>>,
        session?: ClientSession
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
                permissionOwnerId: q.resourceId,
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
            const exists = await ctx.models.permissions.model.exists(
                AccessControlContext.preparePermissionsQuery(
                    orgId,
                    [query],
                    user
                )
            );

            if (!exists) {
                throw new PermissionDeniedError();
            }

            return exists;
        }
    );

    public queryPermissions = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            orgId: string,
            queries: IPermissionQuery[],
            user?: IUser
        ) => {
            const exists = await ctx.models.permissions.model.exists(
                AccessControlContext.preparePermissionsQuery(
                    orgId,
                    queries,
                    user
                )
            );

            if (!exists) {
                throw new PermissionDeniedError();
            }

            return exists;
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
