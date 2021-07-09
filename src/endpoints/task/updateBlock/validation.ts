import Joi from "joi";
import {
    complexFieldJoiSchema,
    validationSchemas,
} from "../../../utilities/validationUtils";
import { taskConstants } from "../constants";
import taskValidationSchemas from "../validation";

const blockData = Joi.object().keys({
    name: taskValidationSchemas.name,
    description: taskValidationSchemas.description,
    color: taskValidationSchemas.color,
    priority: taskValidationSchemas.priority.allow(null),
    assignees: complexFieldJoiSchema(
        taskValidationSchemas.taskAssignee,
        taskConstants.maxTaskCollaboratorsLength,
        "userId"
    ),
    parent: taskValidationSchemas.parent.allow(null),
    subTasks: complexFieldJoiSchema(
        taskValidationSchemas.subTasksSchema,
        taskConstants.maxSubTasks,
        "customId"
    ),
    boardStatuses: complexFieldJoiSchema(
        taskValidationSchemas.statusSchema,
        taskConstants.maxStatuses,
        "customId"
    ),
    boardLabels: complexFieldJoiSchema(
        taskValidationSchemas.labelSchema,
        taskConstants.maxLabels,
        "customId"
    ),
    boardResolutions: complexFieldJoiSchema(
        taskValidationSchemas.resolutionSchema,
        taskConstants.maxResolutions,
        "customId"
    ),
    status: validationSchemas.uuid.allow(null),
    dueAt: taskValidationSchemas.dueAt,
    taskResolution: validationSchemas.uuid.allow(null),
    labels: complexFieldJoiSchema(
        taskValidationSchemas.blockAssignedLabel,
        taskConstants.maxAssignedLabels,
        "customId"
    ),
    taskSprint: taskValidationSchemas.taskSprint,
});

export const updateBlockJoiSchema = Joi.object().keys({
    data: blockData.required(),
    blockId: validationSchemas.uuid.required(),
});
