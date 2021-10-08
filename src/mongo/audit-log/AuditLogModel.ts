import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import auditLogSchema, { IAuditLogDocument } from "./definitions";

const modelName = "audit-log";
const collectionName = "audit-logs";

export const getAuditLogModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<IAuditLogDocument>({
            modelName,
            collectionName,
            rawSchema: auditLogSchema,
            connection: conn,
        });
    }
);

export interface IAuditLogModel extends MongoModel<IAuditLogDocument> {}
