import * as Joi from 'joi';
import {validationSchemas} from '../../utilities/validationUtils';
import {taskConstants} from './constants';
import {ITaskAssignedLabelInput} from './types';

const taskAssigneeSchema = Joi.object().keys({
  userId: validationSchemas.resourceId.required(),
});

const subTaskSchema = Joi.object().keys({
  customId: validationSchemas.resourceId,
  description: Joi.string().trim().max(taskConstants.maxDescriptionLength).required(),
  completedBy: validationSchemas.resourceId.allow(null),
});

const name = Joi.string().trim().max(taskConstants.maxNameLength);
const description = Joi.string().allow(null, '').max(taskConstants.maxDescriptionLength).trim();

const dueAt = Joi.date().allow(null);
const taskAssigneeList = Joi.array()
  .max(taskConstants.maxTaskCollaboratorsLength)
  .unique('userId')
  .items(taskAssigneeSchema);

const priority = Joi.string()
  .lowercase()
  .valid(...taskConstants.priorityValuesArray);

const subTasks = Joi.array().items(subTaskSchema).max(taskConstants.maxSubTasks).unique('customId');

const blockAssignedLabel = Joi.object<ITaskAssignedLabelInput>().keys({
  labelId: validationSchemas.resourceId.required(),
});

const blockAssignedLabelsList = Joi.array()
  .items(blockAssignedLabel)
  .max(taskConstants.maxAssignedLabels)
  .unique('customId');

const taskSprint = Joi.object()
  .keys({
    sprintId: validationSchemas.resourceId.required(),
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
  taskSprint,
  taskAssigneeList,
  taskAssignee: taskAssigneeSchema,
};

export default taskValidationSchemas;
