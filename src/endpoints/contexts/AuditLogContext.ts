import uuid from "uuid/v4";
import {
  AuditLogActionType,
  AuditLogResourceType,
  IAuditLog,
  IAuditLogChange,
  IAuditLogModel,
} from "../../mongo/audit-log";
import { getDate } from "../../utilities/fns";
import logger from "../../utilities/logger";
import { IServerRequest } from "../../utilities/types";

export interface IAuditLogContextModels {
  auditLogModel: IAuditLogModel;
}

export interface IAuditLogFnsInstanceData {
  req: IServerRequest;
}

export interface IAuditLogInsertInput {
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
    models: IAuditLogContextModels,
    instData: IAuditLogFnsInstanceData,
    log: IAuditLogInsertInput
  ) => Promise<void>;
  insertMany: (
    models: IAuditLogContextModels,
    instData: IAuditLogFnsInstanceData,
    log: IAuditLogInsertInput[]
  ) => Promise<void>;
}

export default class AuditLogContext implements IAuditLogContext {
  public async insert(
    models: IAuditLogContextModels,
    instData: IAuditLogFnsInstanceData,
    entry: IAuditLogInsertInput
  ) {
    try {
      const log = this.getLogFromEntry(instData, entry);
      const logDoc = new models.auditLogModel.model(log);
      await logDoc.save();
    } catch (error) {
      logger.error(error);
    }
  }

  public async insertMany(
    models: IAuditLogContextModels,
    instData: IAuditLogFnsInstanceData,
    entries: IAuditLogInsertInput[]
  ) {
    try {
      const logs = entries.map((entry) =>
        this.getLogFromEntry(instData, entry)
      );
      await models.auditLogModel.model.insertMany(logs);
    } catch (error) {
      logger.error(error);
    }
  }

  private getLogFromEntry(
    instData: IAuditLogFnsInstanceData,
    entry: IAuditLogInsertInput
  ): IAuditLog {
    const log: IAuditLog = {
      ...entry,
      date: entry.date || getDate(),
      customId: uuid(),
      createdAt: new Date(),
      ips:
        Array.isArray(instData.req.ips) && instData.req.ips.length > 0
          ? instData.req.ips
          : [instData.req.ip],
      userAgent: instData.req.headers["user-agent"],
    };

    if (!log.userId) {
      log.userId = instData.req.userData && instData.req.userData.customId;
    }

    return log;
  }
}
