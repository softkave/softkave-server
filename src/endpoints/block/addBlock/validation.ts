import Joi from "joi";
import { BlockType } from "../../../mongo/block/definitions";
import { validationSchemas } from "../../../utilities/validationUtils";
import blockValidationSchemas from "../validation";

export const newBlockJoiSchema = Joi.object().keys({
    name: blockValidationSchemas.name.required(),
    description: blockValidationSchemas.description,
    dueAt: blockValidationSchemas.dueAt,
    color: blockValidationSchemas.color.when("type", {
        is: Joi.string().valid([BlockType.Board, BlockType.Org] as BlockType[]),
        then: Joi.required(),
    }),
    parent: blockValidationSchemas.parent.when("type", {
        is: Joi.string().valid([
            BlockType.Board,
            BlockType.Task,
        ] as BlockType[]),
        then: Joi.required(),
    }),
    rootBlockId: blockValidationSchemas.rootBlockId,
    priority: blockValidationSchemas.priority.when("type", {
        is: BlockType.Task,
        then: Joi.required(),
        otherwise: Joi.allow(null),
    }),
    taskSprint: blockValidationSchemas.taskSprint,
    subTasks: blockValidationSchemas.subTasks,
    status: validationSchemas.uuid.allow(null),
    assignees: blockValidationSchemas.taskAssignees,
    type: blockValidationSchemas.type.required(),
    boardStatuses: blockValidationSchemas.statusListSchema,
    boardLabels: blockValidationSchemas.boardLabelList,
    boardResolutions: blockValidationSchemas.boardResolutions,
    taskResolution: validationSchemas.uuid.allow(null),
    labels: blockValidationSchemas.blockAssignedLabelsList,
});

export const addBlockJoiSchema = Joi.object().keys({
    block: newBlockJoiSchema.required(),
});
