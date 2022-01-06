import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import boardValidationSchemas from "../../board/validation";
import taskValidationSchemas from "../validation";

export const newTaskJoiSchema = Joi.object().keys({
    name: taskValidationSchemas.name.required(),
    description: taskValidationSchemas.description.optional().allow(null),
    dueAt: taskValidationSchemas.dueAt.optional().allow(null),
    parent: boardValidationSchemas.parent.required(),
    rootBlockId: boardValidationSchemas.rootBlockId.required(),
    priority: taskValidationSchemas.priority.required(),
    taskSprint: taskValidationSchemas.taskSprint.optional().allow(null),
    subTasks: taskValidationSchemas.subTasks.required(),
    status: validationSchemas.uuid.allow(null),
    assignees: taskValidationSchemas.taskAssigneeList.required(),
    taskResolution: validationSchemas.uuid.allow(null),
    labels: taskValidationSchemas.blockAssignedLabelsList.required(),
});

export const createTaskJoiSchema = Joi.object()
    .keys({
        task: newTaskJoiSchema.required(),
    })
    .required();
