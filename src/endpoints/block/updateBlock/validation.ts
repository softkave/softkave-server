import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { blockConstants } from "../constants";
import blockValidationSchemas from "../validation";

const blockData = Joi.object().keys({
  name: blockValidationSchemas.name,
  description: blockValidationSchemas.updateDescription,
  expectedEndAt: blockValidationSchemas.expectedEndAt,
  color: blockValidationSchemas.color,
  priority: blockValidationSchemas.priority,
  taskCollaborationData: blockValidationSchemas.taskCollaborationData,
  taskCollaborators: blockValidationSchemas.taskCollaborators,
  type: blockValidationSchemas.type,
  parent: validationSchemas.uuid,
  groups: blockValidationSchemas.groups,
  groupTaskContext: blockValidationSchemas.groups,
  groupProjectContext: blockValidationSchemas.groups,
  projects: blockValidationSchemas.projects,
  tasks: blockValidationSchemas.tasks,
  subTasks: blockValidationSchemas.subTasks,
  availableStatus: blockValidationSchemas.statusListSchema,
  availableLabels: blockValidationSchemas.LabelListSchema,
  status: validationSchemas.uuid,
  labels: Joi.array()
    .items(validationSchemas.uuid)
    .max(blockConstants.maxAvailableLabels),
});

export const updateBlockJoiSchema = Joi.object().keys({
  data: blockData,
  customId: blockValidationSchemas.blockID,
});
