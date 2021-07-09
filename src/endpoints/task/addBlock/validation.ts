import Joi from "joi";
import { BlockType } from "../../../mongo/block/definitions";
import { validationSchemas } from "../../../utilities/validationUtils";
import taskValidationSchemas from "../validation";

export const newBlockJoiSchema = Joi.object().keys({
    name: taskValidationSchemas.name.required(),
    description: taskValidationSchemas.description,
    dueAt: taskValidationSchemas.dueAt,
    color: taskValidationSchemas.color.when("type", {
        is: Joi.string().valid([BlockType.Board, BlockType.Org] as BlockType[]),
        then: Joi.required(),
    }),
    parent: taskValidationSchemas.parent.when("type", {
        is: Joi.string().valid([
            BlockType.Board,
            BlockType.Task,
        ] as BlockType[]),
        then: Joi.required(),
    }),
    rootBlockId: taskValidationSchemas.rootBlockId,
    priority: taskValidationSchemas.priority.when("type", {
        is: BlockType.Task,
        then: Joi.required(),
        otherwise: Joi.allow(null),
    }),
    taskSprint: taskValidationSchemas.taskSprint,
    subTasks: taskValidationSchemas.subTasks,
    status: validationSchemas.uuid.allow(null),
    assignees: taskValidationSchemas.taskAssigneeList,
    type: taskValidationSchemas.type.required(),
    boardStatuses: taskValidationSchemas.statusListSchema,
    boardLabels: taskValidationSchemas.boardLabelList,
    boardResolutions: taskValidationSchemas.boardResolutions,
    taskResolution: validationSchemas.uuid.allow(null),
    labels: taskValidationSchemas.blockAssignedLabelsList,
});

export const addBlockJoiSchema = Joi.object().keys({
    block: newBlockJoiSchema.required(),
});
