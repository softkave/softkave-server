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
    priority: blockValidationSchemas.priority,
    assignees: complexFieldJoiSchema(
        blockValidationSchemas.taskAssignees,
        blockConstants.maxTaskCollaboratorsLength,
        "userId"
    ),
    type: blockValidationSchemas.type,
    parent: blockValidationSchemas.parent,
    subTasks: complexFieldJoiSchema(
        blockValidationSchemas.subTasks,
        blockConstants.maxSubTasks,
        "customId"
    ),
    boardStatuses: complexFieldJoiSchema(
        blockValidationSchemas.statusListSchema,
        blockConstants.maxStatuses,
        "customId"
    ),
    boardLabels: complexFieldJoiSchema(
        blockValidationSchemas.boardLabelList,
        blockConstants.maxLabels,
        "customId"
    ),
    boardResolutions: complexFieldJoiSchema(
        blockValidationSchemas.boardResolutions,
        blockConstants.maxResolutions,
        "customId"
    ),
    status: validationSchemas.uuid,
    dueAt: blockValidationSchemas.dueAt,
    taskResolution: validationSchemas.uuid.allow(null),
    labels: complexFieldJoiSchema(
        blockValidationSchemas.blockAssignedLabelsList,
        blockConstants.maxAssignedLabels,
        "customId"
    ),
    taskSprint: blockValidationSchemas.taskSprint,
});

export const updateBlockJoiSchema = Joi.object().keys({
    data: blockData.required(),
    blockId: validationSchemas.uuid.required(),
});
