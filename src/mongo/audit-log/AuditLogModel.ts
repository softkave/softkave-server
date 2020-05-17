import MongoModel, {
  IDerivedMongoModelInitializationProps,
} from "../MongoModel";
import auditLogSchema, { IAuditLogDocument } from "./definitions";

const modelName = "audit-log";
const collectionName = "audit-logs";

class AuditLogModel extends MongoModel<IAuditLogDocument> {
  constructor({ connection }: IDerivedMongoModelInitializationProps) {
    super({
      connection,
      modelName,
      collectionName,
      rawSchema: auditLogSchema,
    });
  }
}

export default AuditLogModel;
