import Joi from "joi";
import blockValidationSchemas from "../validation";

const blockData = Joi.object().keys({
  name: blockValidationSchemas.name,
  description: blockValidationSchemas.description,
  expectedEndAt: blockValidationSchemas.expectedEndAt,
  color: blockValidationSchemas.color,
  priority: blockValidationSchemas.priority,
  taskCollaborationData: blockValidationSchemas.taskCollaborationData,
  taskCollaborators: blockValidationSchemas.taskCollaborators,
  type: blockValidationSchemas.type,
  parent: blockValidationSchemas.parent,
  groups: blockValidationSchemas.groups,
  groupTaskContext: blockValidationSchemas.groups,
  groupProjectContext: blockValidationSchemas.groups,
  projects: blockValidationSchemas.projects,
  tasks: blockValidationSchemas.tasks,
  subTasks: blockValidationSchemas.subTasks
});

export const updateBlockJoiSchema = Joi.object().keys({
  data: blockData,
  customId: blockValidationSchemas.blockID
});
