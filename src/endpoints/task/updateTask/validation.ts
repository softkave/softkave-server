import Joi from "joi";
import {
    complexFieldJoiSchema,
    validationSchemas,
} from "../../../utilities/validationUtils";
import boardValidationSchemas from "../../board/validation";
import { taskConstants } from "../constants";
import taskValidationSchemas from "../validation";

const taskInput = Joi.object().keys({
    name: taskValidationSchemas.name,
    description: taskValidationSchemas.description.optional().allow([null]),
    priority: taskValidationSchemas.priority,
    assignees: complexFieldJoiSchema(
        taskValidationSchemas.taskAssignee,
        taskConstants.maxTaskCollaboratorsLength,
        "userId"
    ),
    parent: boardValidationSchemas.parent,
    subTasks: complexFieldJoiSchema(
        taskValidationSchemas.subTaskSchema,
        taskConstants.maxSubTasks,
        "customId"
    ),
    status: validationSchemas.uuid.optional().allow([null]),
    dueAt: taskValidationSchemas.dueAt.optional().allow([null]),
    taskResolution: validationSchemas.uuid.optional().allow([null]),
    labels: complexFieldJoiSchema(
        taskValidationSchemas.blockAssignedLabel,
        taskConstants.maxAssignedLabels,
        "customId"
    ),
    taskSprint: taskValidationSchemas.taskSprint.optional().allow([null]),
});

export const updateTaskJoiSchema = Joi.object().keys({
    data: taskInput.required(),
    taskId: validationSchemas.uuid.required(),
});
