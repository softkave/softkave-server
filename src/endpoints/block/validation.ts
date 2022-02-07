import Joi from "joi";
import { BlockType } from "../../mongo/block";
import { regEx, validationSchemas } from "../../utilities/validationUtils";
import { blockConstants } from "./constants";

const taskCollaboratorSchema = Joi.object().keys({
    userId: validationSchemas.uuid.required(),
});

const userUpdateableblockTypeSchema = Joi.string()
    .lowercase()
    .valid(BlockType.Organization, BlockType.Board, BlockType.Task);

const fullBlockTypes = [
    BlockType.Organization,
    BlockType.Board,
    BlockType.Task,
    BlockType.Root,
] as BlockType[];

const fullBlockTypeSchema = Joi.string()
    .lowercase()
    .valid(...fullBlockTypes);
const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);

const subTasksSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    description: Joi.string()
        .trim()
        .max(blockConstants.maxDescriptionLength)
        .required(),
    completedBy: Joi.string().uuid().allow(null),
});

// TODO: run trim on all string inputs
const labelSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    color: color.required(),
    name: Joi.string()
        .lowercase()
        .trim()
        .min(blockConstants.minLabelNameLength)
        .max(blockConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow("", null)
        .trim()
        .max(blockConstants.maxLabelDescriptionLength)
        .optional(),
});

const statusSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    color: color.required(),
    position: Joi.number().min(0).required(),
    name: Joi.string()
        .trim()
        .lowercase()
        .min(blockConstants.minLabelNameLength)
        .max(blockConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow("", null)
        .trim()
        .max(blockConstants.maxLabelDescriptionLength)
        .optional(),
});

const resolutionSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    name: Joi.string()
        .trim()
        .lowercase()
        .min(blockConstants.minLabelNameLength)
        .max(blockConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow("", null)
        .trim()
        .max(blockConstants.maxLabelDescriptionLength)
        .optional(),
});

const statusListSchema = Joi.array()
    .max(blockConstants.maxStatuses)
    .items(statusSchema)
    .unique("customId")
    .unique("name")
    .allow(null);

const boardLabelList = Joi.array()
    .max(blockConstants.maxLabels)
    .items(labelSchema)
    .unique("customId")
    .unique("name")
    .allow(null);

const resolutionListSchema = Joi.array()
    .max(blockConstants.maxResolutions)
    .items(resolutionSchema)
    .unique("customId")
    .unique("name")
    .allow(null);

const blockTypesSchema = Joi.array()
    .max(blockConstants.blockTypesCount)
    .unique()
    .items(userUpdateableblockTypeSchema);

const name = Joi.string().trim().max(blockConstants.maxNameLength);

const description = Joi.string()
    .allow(null, "")
    .max(blockConstants.maxDescriptionLength)
    .trim();

const dueAt = Joi.date().allow(null);
const createdAt = Joi.date();
const updatedAt = Joi.date().allow(null);
const parent = validationSchemas.uuid;
const rootBlockId = parent;
const createdBy = validationSchemas.uuid;
const taskAssignees = Joi.array()
    .max(blockConstants.maxTaskCollaboratorsLength)
    .unique("userId")
    .items(taskCollaboratorSchema);

const priority = Joi.string()
    .lowercase()
    .valid(...blockConstants.priorityValuesArray);

const subTasks = Joi.array()
    .items(subTasksSchema)
    .max(blockConstants.maxSubTasks)
    .unique("customId");

const blockAssignedLabel = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
});

const blockAssignedLabelsList = Joi.array()
    .items(blockAssignedLabel)
    .max(blockConstants.maxAssignedLabels)
    .unique("customId");

const statusAssignedBy = validationSchemas.uuid.allow("system").when("type", {
    is: BlockType.Task,
    then: Joi.required(),
}); // TODO: "system" exploitable

const taskSprint = Joi.object()
    .keys({
        sprintId: validationSchemas.uuid.required(),
    })
    .allow(null);

const blockValidationSchemas = {
    name,
    description,
    dueAt,
    createdAt,
    color,
    createdBy,
    priority,
    subTasksSchema,
    subTasks,
    parent,
    rootBlockId,
    updatedAt,
    statusSchema,
    labelSchema,
    statusListSchema,
    boardLabelList,
    blockAssignedLabel,
    blockAssignedLabelsList,
    statusAssignedBy,
    resolutionSchema,
    taskSprint,
    taskCollaboratorSchema,
    taskAssignees,
    boardResolutions: resolutionListSchema,
    blockTypesList: blockTypesSchema,
    type: userUpdateableblockTypeSchema,
    fullBlockType: fullBlockTypeSchema,
};

export default blockValidationSchemas;
