import Joi from "joi";
import {
    complexFieldJoiSchema,
    validationSchemas,
} from "../../../utilities/validationUtils";
import organizationValidationSchemas from "../../organization/validation";
import { boardConstants } from "../constants";
import boardValidationSchemas from "../validation";

export const updateBoardJoiSchema = Joi.object()
    .keys({
        data: Joi.object()
            .keys({
                name: organizationValidationSchemas.name,
                description: organizationValidationSchemas.description
                    .optional()
                    .allow(null),
                color: organizationValidationSchemas.color,
                parent: boardValidationSchemas.parent,
                boardStatuses: complexFieldJoiSchema(
                    boardValidationSchemas.statusSchema,
                    boardConstants.maxStatuses,
                    "customId"
                ),
                boardLabels: complexFieldJoiSchema(
                    boardValidationSchemas.labelSchema,
                    boardConstants.maxLabels,
                    "customId"
                ),
                boardResolutions: complexFieldJoiSchema(
                    boardValidationSchemas.resolutionSchema,
                    boardConstants.maxResolutions,
                    "customId"
                ),
            })
            .required(),
        boardId: validationSchemas.uuid.required(),
    })
    .required();
