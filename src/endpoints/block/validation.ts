import Joi from "joi";
import { BlockType } from "../../mongo/block";
import { regEx, validationSchemas } from "../../utilities/validationUtils";
import { blockConstants } from "./constants";

const taskCollaboratorSchema = Joi.object().keys({
    userId: validationSchemas.uuid.required(),
    assignedBy: validationSchemas.uuid.required(),
    assignedAt: Joi.date().required(),
});

const taskCollaboratorsListSchema = Joi.array()
    .max(blockConstants.maxTaskCollaboratorsLength)
    .unique("userId")
    .items(taskCollaboratorSchema);

const userUpdateableTypes = [
    BlockType.Org,
    BlockType.Board,
    BlockType.Task,
] as BlockType[];
const userUpdateableblockTypeSchema = Joi.string()
    .lowercase()
    .valid(userUpdateableTypes);

const fullBlockTypes = [...userUpdateableTypes, BlockType.Root] as BlockType[];
const fullBlockTypeSchema = Joi.string().lowercase().valid(fullBlockTypes);
const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);

const subTasksSchema = Joi.object().keys({
    customId: Joi.string().uuid().required(),
    description: Joi.string()
        .trim()
        .max(blockConstants.maxDescriptionLength)
        .required(),
    completedBy: Joi.string().uuid().allow(null),
    completedAt: Joi.date().allow(null),
    createdAt: Joi.date().required(),
    createdBy: Joi.string().uuid().required(),
    updatedAt: Joi.date().allow(null),
    updatedBy: Joi.string().uuid().allow(null),
});

// TODO: run trim on all string inputs
const labelSchema = Joi.object().keys({
    color,
    customId: Joi.string().uuid().required(),
    name: Joi.string()
        .lowercase()
        .trim()
        .min(blockConstants.minLabelNameLength)
        .max(blockConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow("")
        .trim()
        .max(blockConstants.maxLabelDescriptionLength)
        .optional(),
    createdAt: Joi.date().required(),
    createdBy: Joi.string().uuid().required(),
    updatedAt: Joi.date().allow(null),
    updatedBy: Joi.string().uuid().allow(null),
});

const statusSchema = Joi.object().keys({
    color,
    customId: Joi.string().uuid().required(),
    name: Joi.string()
        .trim()
        .lowercase()
        .min(blockConstants.minLabelNameLength)
        .max(blockConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow("")
        .trim()
        .max(blockConstants.maxLabelDescriptionLength)
        .optional(),
    createdAt: Joi.date().required(),
    createdBy: Joi.string().uuid().allow("system").required(), // TODO: find a fix. allowing system can be exploited
    updatedAt: Joi.date().allow(null),
    updatedBy: Joi.string().uuid().allow(null),
});

const resolutionSchema = Joi.object().keys({
    customId: Joi.string().uuid().required(),
    name: Joi.string()
        .trim()
        .lowercase()
        .min(blockConstants.minLabelNameLength)
        .max(blockConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow("")
        .trim()
        .max(blockConstants.maxLabelDescriptionLength)
        .optional(),
    createdAt: Joi.date().required(),
    createdBy: Joi.string().uuid().required(),
    updatedAt: Joi.date().allow(null),
    updatedBy: Joi.string().uuid().allow(null),
});

const statusListSchema = Joi.array()
    .max(blockConstants.maxAvailableLabels)
    .items(statusSchema)
    .when("type", {
        is: BlockType.Board,
        then: Joi.required(),
    });

// TODO: should labels and statuses be unique?
// .unique((a: IBlockStatus, b: IBlockStatus) => {
//   return a.customId === b.customId || a.name === b.name;
// });

const boardLabelList = Joi.array()
    .max(blockConstants.maxAvailableLabels)
    .items(labelSchema)
    .when("type", {
        is: BlockType.Board,
        then: Joi.required(),
    });

const resolutionListSchema = Joi.array()
    .max(blockConstants.maxAvailableLabels)
    .items(resolutionSchema)
    .when("type", {
        is: BlockType.Board,
        then: Joi.required(),
        otherwise: Joi.allow(null),
    });

const blockTypesSchema = Joi.array()
    .max(blockConstants.blockTypesCount)
    .unique()
    .items(userUpdateableblockTypeSchema);

const blockId = validationSchemas.uuid;

const name = Joi.string().trim().max(blockConstants.maxNameLength);

const updateBlockName = name.when("type", {
    is: Joi.string().valid([BlockType.Task] as BlockType[]),
    then: Joi.allow(null),
    otherwise: Joi.required(),
});

const newBlockOriginalName = name.required();

const lowerCasedName = name.lowercase();

const description = Joi.string()
    .allow("")
    .max(blockConstants.maxDescriptionLength)
    .trim();

const updateDescription = Joi.string()
    .allow([""])
    .max(blockConstants.maxDescriptionLength)
    .trim();

const dueAt = Joi.date().allow(null);
const createdAt = Joi.date();

const updatedAt = Joi.date();
const parent = validationSchemas.uuid.when("type", {
    is: Joi.string().valid([BlockType.Board, BlockType.Task] as BlockType[]),
    then: Joi.required(),
});

const rootBlockId = parent;
const createdBy = validationSchemas.uuid;
const taskAssignees = taskCollaboratorsListSchema;
const priority = Joi.string()
    .lowercase()
    .valid(blockConstants.priorityValuesArray)
    .when("type", {
        is: BlockType.Task,
        then: Joi.required(),
    });

const subTasks = Joi.array()
    .items(subTasksSchema)
    .max(blockConstants.maxSubTasksLength);

const blockAssignedLabels = Joi.object().keys({
    customId: validationSchemas.uuid,
    assignedBy: validationSchemas.uuid,
    assignedAt: Joi.date(),
});

const blockAssignedLabelsList = Joi.array()
    .items(blockAssignedLabels)
    .max(blockConstants.maxAvailableLabels);

const statusAssignedBy = validationSchemas.uuid.allow("system").when("type", {
    is: BlockType.Task,
    then: Joi.required(),
}); // TODO: exploitable

const taskStatusSchema = validationSchemas.uuid.when("type", {
    is: BlockType.Task,
    then: Joi.required(),
    otherwise: Joi.allow(null),
});

const newBlock = Joi.object().keys({
    name: newBlockOriginalName,
    description,
    dueAt,
    color,
    parent,
    rootBlockId,
    priority,
    assignees: taskAssignees,
    subTasks,
    customId: blockId,
    type: userUpdateableblockTypeSchema,
    boardStatuses: statusListSchema,
    boardLabels: boardLabelList,
    boardResolutions: resolutionListSchema,
    status: taskStatusSchema,
    statusAssignedBy,
    statusAssignedAt: Joi.date().when("type", {
        is: BlockType.Task,
        then: Joi.required(),
    }),
    taskResolution: validationSchemas.uuid,
    labels: blockAssignedLabelsList,
});

const blockValidationSchemas = {
    updateBlockName,
    lowerCasedName,
    blockId,
    dueAt,
    createdAt,
    color,
    createdBy,
    assignees: taskAssignees,
    priority,
    subTasks,
    parent,
    rootBlockId,
    updatedAt,
    newBlock,
    blockTypesList: blockTypesSchema,
    type: userUpdateableblockTypeSchema,
    fullBlockType: fullBlockTypeSchema,
    statusSchema,
    labelSchema,
    statusListSchema,
    boardLabelList,
    updateDescription,
    blockAssignedLabels,
    blockAssignedLabelsList,
    statusAssignedBy,
    resolutionSchema,
    resolutionListSchema,
    boardResolutions: resolutionListSchema,
    taskResolution: validationSchemas.uuid.allow(null),
};

export default blockValidationSchemas;
