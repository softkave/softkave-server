import { auditLogSchemaVersion } from "./audit-log";
import { blockSchemaVersion } from "./block";
import { notificationSchemaVersion } from "./notification";
import { userSchemaVersion } from "./user";

const schemaVersions = {
  block: blockSchemaVersion,
  notfication: notificationSchemaVersion,
  user: userSchemaVersion,
  auditLog: auditLogSchemaVersion,
};

export default schemaVersions;
