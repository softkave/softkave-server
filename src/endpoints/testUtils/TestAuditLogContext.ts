import { IAuditLog } from "../../mongo/audit-log";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import {
    getLogFromEntry,
    IAuditLogContext,
    IAuditLogInsertEntry,
} from "../contexts/AuditLogContext";
import { IBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";

const auditLogs: IAuditLog[] = [];

class TestAuditLogContext implements IAuditLogContext {
    public insertMany = async (
        ctx: IBaseContext,
        data: RequestData,
        entries: IAuditLogInsertEntry[]
    ) => {
        const user = await ctx.session.getUser(ctx, data);
        entries.forEach((entry) => {
            const log = getLogFromEntry(data, entry, user);
            auditLogs.push(log);
        });
    };

    public insert(
        ctx: IBaseContext,
        data: RequestData,
        log: IAuditLogInsertEntry
    ) {
        return ctx.auditLog.insertMany(ctx, data, [log]);
    }
}

export const getTestAuditLogContext = makeSingletonFn(
    () => new TestAuditLogContext()
);
