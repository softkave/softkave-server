import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import blockValidationSchemas from "../validation";

const blockData = Joi.object().keys({
    name: blockValidationSchemas.updateBlockName,
    description: blockValidationSchemas.updateDescription,
    color: blockValidationSchemas.color,
    priority: blockValidationSchemas.priority,
    assignees: blockValidationSchemas.assignees,
    type: blockValidationSchemas.type,
    parent: validationSchemas.uuid,
    subTasks: blockValidationSchemas.subTasks,
    boardStatuses: blockValidationSchemas.statusListSchema,
    boardLabels: blockValidationSchemas.boardLabelList,
    boardResolutions: blockValidationSchemas.boardResolutions,
    status: validationSchemas.uuid,
    dueAt: blockValidationSchemas.dueAt,
    statusAssignedBy: blockValidationSchemas.statusAssignedBy,
    statusAssignedAt: Joi.date(),
    taskResolution: blockValidationSchemas.taskResolution,
    labels: blockValidationSchemas.blockAssignedLabelsList,
    taskSprint: blockValidationSchemas.taskSprint,
});

export const updateBlockJoiSchema = Joi.object().keys({
    data: blockData,
    blockId: blockValidationSchemas.blockId,
});
