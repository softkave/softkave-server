import Joi from "joi";
import {
    complexFieldJoiSchema,
    validationSchemas,
} from "../../../utilities/validationUtils";
import { blockConstants } from "../constants";
import blockValidationSchemas from "../validation";

const blockData = Joi.object().keys({
    name: blockValidationSchemas.name,
    description: blockValidationSchemas.description,
    color: blockValidationSchemas.color,
    priority: blockValidationSchemas.priority.allow(null),
    assignees: complexFieldJoiSchema(
        blockValidationSchemas.taskCollaboratorSchema,
        blockConstants.maxTaskCollaboratorsLength,
        "userId"
    ),
    parent: blockValidationSchemas.parent.allow(null),
    subTasks: complexFieldJoiSchema(
        blockValidationSchemas.subTasksSchema,
        blockConstants.maxSubTasks,
        "customId"
    ),
    boardStatuses: complexFieldJoiSchema(
        blockValidationSchemas.statusSchema,
        blockConstants.maxStatuses,
        "customId"
    ),
    boardLabels: complexFieldJoiSchema(
        blockValidationSchemas.labelSchema,
        blockConstants.maxLabels,
        "customId"
    ),
    boardResolutions: complexFieldJoiSchema(
        blockValidationSchemas.resolutionSchema,
        blockConstants.maxResolutions,
        "customId"
    ),
    status: validationSchemas.uuid.allow(null),
    dueAt: blockValidationSchemas.dueAt,
    taskResolution: validationSchemas.uuid.allow(null),
    labels: complexFieldJoiSchema(
        blockValidationSchemas.blockAssignedLabel,
        blockConstants.maxAssignedLabels,
        "customId"
    ),
    taskSprint: blockValidationSchemas.taskSprint,
});

export const updateBlockJoiSchema = Joi.object().keys({
    data: blockData.required(),
    blockId: validationSchemas.uuid.required(),
});
