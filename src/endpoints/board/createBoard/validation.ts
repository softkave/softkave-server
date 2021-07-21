import Joi from "joi";
import organizationValidationSchemas from "../../organization/validation";
import boardValidationSchemas from "../validation";

export const newBoardJoiSchema = Joi.object().keys({
    name: organizationValidationSchemas.name.required(),
    description: organizationValidationSchemas.description
        .optional()
        .allow([null]),
    color: organizationValidationSchemas.color.required(),
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
