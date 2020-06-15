import Joi from "joi";
import { AuditLogResourceType } from "../../mongo/audit-log";

const resourceType = Joi.string()
  .lowercase()
  .valid([AuditLogResourceType.Board]);

const socketValidationSchemas = {
  resourceType,
};

export default socketValidationSchemas;
