import { SystemActionType, SystemResourceType } from "../../models/system";
import { IAuditLog, IAuditLogChange } from "../../mongo/audit-log";
import { IUser } from "../../mongo/user";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import getNewId from "../../utilities/getNewId";
import RequestData from "../RequestData";
import { wrapFireAndThrowError } from "../utils";
import { IBaseContext } from "./BaseContext";

export interface IAuditLogInsertEntry {
    action: SystemActionType;
    resourceId?: string;
    resourceType: SystemResourceType;
    userId?: string;
    organizationId?: string;
    change?: IAuditLogChange;
    resourceOwnerId?: string; // for status and labels, and other "inside" resources
    date?: Date;
}

export interface IAuditLogContext {
    insert: (
        ctx: IBaseContext,
        data: RequestData,
        log: IAuditLogInsertEntry
    ) => Promise<void>;
    insertMany: (
        ctx: IBaseContext,
        data: RequestData,
        log: IAuditLogInsertEntry[]
    ) => Promise<void>;
}

export function getLogFromEntry(
    data: RequestData,
    entry: IAuditLogInsertEntry,
    user: IUser
): IAuditLog {
    const log: IAuditLog = {
        ...entry,
        date: entry.date || getDate(),
        customId: getNewId(),
        createdAt: new Date(),
        ips: data.ips,
        userAgent: data.userAgent,
        userId: user.customId,
    };

    return log;
}

export default class AuditLogContext implements IAuditLogContext {
    public insertMany = wrapFireAndThrowError(
        async (
            ctx: IBaseContext,
            data: RequestData,
            entries: IAuditLogInsertEntry[]
        ) => {
            // TODO: how can we retry failed saves, here, and accross the server
            const user = await ctx.session.getUser(ctx, data);
            const logs = entries.map((entry) =>
                getLogFromEntry(data, entry, user)
            );
            await ctx.models.auditLogModel.model.insertMany(logs);
        }
    );

    public insert(
        ctx: IBaseContext,
        data: RequestData,
        log: IAuditLogInsertEntry
    ) {
        return ctx.auditLog.insertMany(ctx, data, [log]);
    }
}

export const getAuditLogContext = makeSingletonFunc(
    () => new AuditLogContext()
);
