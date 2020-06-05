import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import blockValidationSchemas from "../validation";

const blockData = Joi.object().keys({
  name: blockValidationSchemas.name,
  description: blockValidationSchemas.updateDescription,
  color: blockValidationSchemas.color,
  priority: blockValidationSchemas.priority,
  assignees: blockValidationSchemas.assignees,
  type: blockValidationSchemas.type,
  parent: validationSchemas.uuid,
  subTasks: blockValidationSchemas.subTasks,
  boardStatuses: blockValidationSchemas.statusListSchema,
  boardLabels: blockValidationSchemas.boardLabelList,
  status: validationSchemas.uuid,
  dueAt: blockValidationSchemas.dueAt,
  statusAssignedBy: blockValidationSchemas.statusAssignedBy,
  statusAssignedAt: Joi.date(),
  labels: blockValidationSchemas.blockAssignedLabelsList,
});

export const updateBlockJoiSchema = Joi.object().keys({
  data: blockData,
  blockId: blockValidationSchemas.blockId,
});
