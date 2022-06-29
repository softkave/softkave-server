import { auditLogSchemaVersion } from "./audit-log";
import { blockSchemaVersion } from "./block";
import { userSchemaVersion } from "./user";

const schemaVersions = {
  block: blockSchemaVersion,
  user: userSchemaVersion,
  auditLog: auditLogSchemaVersion,
};

export default schemaVersions;
