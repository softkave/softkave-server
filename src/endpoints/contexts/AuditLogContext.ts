import uuid from "uuid/v4";
import {
  AuditLogActionType,
  AuditLogResourceType,
  IAuditLog,
  IAuditLogChange,
} from "../../mongo/audit-log";
import createSingletonFunc from "../../utilities/createSingletonFunc";
import { getDate } from "../../utilities/fns";
import logger from "../../utilities/logger";
import { IBaseContext } from "./BaseContext";
import RequestData from "./RequestData";

export interface IAuditLogInsertEntry {
  action: AuditLogActionType;
  resourceId: string;
  resourceType: AuditLogResourceType;
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

export default class AuditLogContext implements IAuditLogContext {
  public async insert(
    ctx: IBaseContext,
    data: RequestData,
    entry: IAuditLogInsertEntry
  ) {
    try {
      const log = this.getLogFromEntry(data, entry);
      const logDoc = new ctx.models.auditLogModel.model(log);
      await logDoc.save();
    } catch (error) {
      logger.error(error);
    }
  }

  public async insertMany(
    ctx: IBaseContext,
    data: RequestData,
    entries: IAuditLogInsertEntry[]
  ) {
    try {
      const logs = entries.map((entry) => this.getLogFromEntry(data, entry));
      await ctx.models.auditLogModel.model.insertMany(logs);
    } catch (error) {
      logger.error(error);
    }
  }

  private getLogFromEntry(
    data: RequestData,
    entry: IAuditLogInsertEntry
  ): IAuditLog {
    const log: IAuditLog = {
      ...entry,
      date: entry.date || getDate(),
      customId: uuid(),
      createdAt: new Date(),
      ips: data.ips,
      userAgent: data.userAgent,
    };

    if (!log.userId) {
      log.userId = data.tokenData ? data.tokenData.sub.id : undefined;
    }

    return log;
  }
}

export const getAuditLogContext = createSingletonFunc(
  () => new AuditLogContext()
);
