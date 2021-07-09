import Joi from "joi";
import orgValidationSchemas from "../../org/validation";
import boardValidationSchemas from "../validation";

export const newBoardJoiSchema = Joi.object().keys({
    name: orgValidationSchemas.name.required(),
    description: orgValidationSchemas.description.optional().allow([null]),
    color: orgValidationSchemas.color.required(),
    parent: boardValidationSchemas.parent.required(),
    boardStatuses: boardValidationSchemas.statusListSchema.required(),
    boardLabels: boardValidationSchemas.boardLabelList.required(),
    boardResolutions: boardValidationSchemas.boardResolutions.required(),
});

export const addBoardJoiSchema = Joi.object()
    .keys({
        board: newBoardJoiSchema.required(),
    })
    .required();
