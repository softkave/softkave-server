import Joi from "joi";
import { BlockType } from "../../mongo/block";
import { validationSchemas } from "../../utilities/validationUtils";
import { taskConstants } from "./constants";

const taskAssigneeSchema = Joi.object().keys({
    userId: validationSchemas.uuid.required(),
});

const subTaskSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    description: Joi.string()
        .trim()
        .max(taskConstants.maxDescriptionLength)
        .required(),
    completedBy: Joi.string().uuid().allow(null),
});

const name = Joi.string().trim().max(taskConstants.maxNameLength);
const description = Joi.string()
    .allow([null, ""])
    .max(taskConstants.maxDescriptionLength)
    .trim();

const dueAt = Joi.date().allow(null);
const taskAssigneeList = Joi.array()
    .max(taskConstants.maxTaskCollaboratorsLength)
    .unique("userId")
    .items(taskAssigneeSchema);

const priority = Joi.string()
    .lowercase()
    .valid(taskConstants.priorityValuesArray);

const subTasks = Joi.array()
    .items(subTaskSchema)
    .max(taskConstants.maxSubTasks)
    .unique("customId");

const blockAssignedLabel = Joi.object().keys({
    customId: validationSchemas.uuid.required(),
});

const blockAssignedLabelsList = Joi.array()
    .items(blockAssignedLabel)
    .max(taskConstants.maxAssignedLabels)
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

const taskValidationSchemas = {
    name,
    description,
    dueAt,
    priority,
    subTaskSchema,
    subTasks,
    blockAssignedLabel,
    blockAssignedLabelsList,
    statusAssignedBy,
    taskSprint,
    taskAssigneeList,
    taskAssignee: taskAssigneeSchema,
};

export default taskValidationSchemas;
