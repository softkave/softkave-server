import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { blockConstants } from "../constants";
import blockValidationSchemas from "../validation";

const blockData = Joi.object().keys({
    name: blockValidationSchemas.name,
    description: blockValidationSchemas.description,
    color: blockValidationSchemas.color,
    priority: blockValidationSchemas.priority,
    assignees: blockValidationSchemas.taskAssignees,
    type: blockValidationSchemas.type,
    parent: blockValidationSchemas.parent,
    subTasks: blockValidationSchemas.subTasks,
    boardStatuses: blockValidationSchemas.statusListSchema,
    boardLabels: blockValidationSchemas.boardLabelList,
    boardResolutions: blockValidationSchemas.boardResolutions,
    status: validationSchemas.uuid,
    dueAt: blockValidationSchemas.dueAt,
    statusAssignedBy: blockValidationSchemas.statusAssignedBy,
    statusAssignedAt: Joi.date(),
    taskResolution: validationSchemas.uuid.allow(null),
    labels: blockValidationSchemas.blockAssignedLabelsList,
    taskSprint: blockValidationSchemas.taskSprint,
});

export const updateBlockJoiSchema = Joi.object().keys({
    data: blockData,
    blockId: validationSchemas.uuid.required(),
});
