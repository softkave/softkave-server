import { Connection } from "mongoose";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import auditLogSchema, { IAuditLogDocument } from "./definitions";

const modelName = "audit-log";
const collectionName = "audit-logs";

let auditlogModel: IAuditLogModel = null;

export function getAuditLogModel(
  conn: Connection = getDefaultConnection().getConnection()
) {
  if (auditlogModel) {
    return auditlogModel;
  }

  auditlogModel = new MongoModel<IAuditLogDocument>({
    modelName,
    collectionName,
    rawSchema: auditLogSchema,
    connection: conn,
  });

  return auditlogModel;
}

export interface IAuditLogModel extends MongoModel<IAuditLogDocument> {}
