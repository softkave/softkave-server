import Joi from "joi";
import { regEx, validationSchemas } from "../../utilities/validationUtils";
import { boardConstants } from "./constants";

const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);
const labelSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    color: color.required(),
    name: Joi.string()
        .lowercase()
        .trim()
        .min(boardConstants.minLabelNameLength)
        .max(boardConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow(["", null])
        .trim()
        .max(boardConstants.maxLabelDescriptionLength)
        .optional(),
});

const statusSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    color: color.required(),
    position: Joi.number().min(0).required(),
    name: Joi.string()
        .trim()
        .lowercase()
        .min(boardConstants.minLabelNameLength)
        .max(boardConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow(["", null])
        .trim()
        .max(boardConstants.maxLabelDescriptionLength)
        .optional(),
});

const resolutionSchema = Joi.object().keys({
    customId: validationSchemas.uuid,
    name: Joi.string()
        .trim()
        .lowercase()
        .min(boardConstants.minLabelNameLength)
        .max(boardConstants.maxLabelNameLength)
        .required(),
    description: Joi.string()
        .allow(["", null])
        .trim()
        .max(boardConstants.maxLabelDescriptionLength)
        .optional(),
});

const statusListSchema = Joi.array()
    .max(boardConstants.maxStatuses)
    .items(statusSchema)
    .unique("customId")
    .unique("name");

const boardLabelList = Joi.array()
    .max(boardConstants.maxLabels)
    .items(labelSchema)
    .unique("customId")
    .unique("name");

const resolutionListSchema = Joi.array()
    .max(boardConstants.maxResolutions)
    .items(resolutionSchema)
    .unique("customId")
    .unique("name");

const parent = validationSchemas.uuid;
const rootBlockId = parent;

const boardValidationSchemas = {
    parent,
    rootBlockId,
    statusSchema,
    labelSchema,
    statusListSchema,
    boardLabelList,
    resolutionSchema,
    boardResolutions: resolutionListSchema,
};

export default boardValidationSchemas;
