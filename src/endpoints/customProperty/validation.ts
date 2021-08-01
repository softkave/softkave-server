import Joi from "joi";
import { BlockType } from "../../mongo/block";
import {
    CustomPropertyType,
    NumberTypes,
    SelectionResourceTypes,
    TextResourceTypes,
} from "../../mongo/custom-property/definitions";
import { validationSchemas } from "../../utilities/validationUtils";
import { customPropertyConstants } from "./constants";

const name = Joi.string().max(customPropertyConstants.nameMax);
const description = Joi.string().max(customPropertyConstants.descriptionMax);
const type = Joi.string().valid([
    CustomPropertyType.Text,
    CustomPropertyType.Date,
    CustomPropertyType.Selection,
    CustomPropertyType.Number,
]);

const isRequired = Joi.bool();
const textResourceType = Joi.string().valid([TextResourceTypes.Text]);

const textMeta = Joi.object().keys({
    minChars: Joi.number().min(0),
    maxChars: Joi.number()
        .max(customPropertyConstants.textMax)
        .default(customPropertyConstants.textMax),
    type: textResourceType.required(),
});

const dateMeta = Joi.object().keys({
    isRange: Joi.bool(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
});

const selectionResourceType = Joi.string().valid([
    SelectionResourceTypes.Collaborator,
    SelectionResourceTypes.Board,
    SelectionResourceTypes.Task,
    SelectionResourceTypes.Room,
    SelectionResourceTypes.CollaborationRequest,
    SelectionResourceTypes.Custom,
]);

const customSelectionOption = Joi.object().keys({
    description,
    name: name.required(),
    color: validationSchemas.color,
    prevOptionId: validationSchemas.uuid,
    nextOptionId: validationSchemas.uuid,
});

const selectionMeta = Joi.object().keys({
    type: selectionResourceType.required(),
    isMultiple: Joi.bool(),
    min: Joi.number().min(0),
    max: Joi.number()
        .max(customPropertyConstants.selectionMax)
        .default(customPropertyConstants.selectionMax),
    selectFrom: Joi.any().when("type", {
        is: Joi.string().valid([SelectionResourceTypes.Custom]),
        then: Joi.valid(null),
        otherwise: Joi.object()
            .keys({
                customId: validationSchemas.uuid.required(),
                type: Joi.string()
                    .valid([BlockType.Organization, BlockType.Board])
                    .required(),
            })
            .required(),
    }),
});

const numberType = Joi.string().valid([
    NumberTypes.Interger,
    NumberTypes.Decimal,
]);

const numberMeta = Joi.object().keys({
    type: numberType.required(),
    min: Joi.number(),
    max: Joi.number(),
    format: Joi.object().keys({
        decimalPlaces: Joi.number(),
    }),
});

const textValue = {
    value: validationSchemas.uuid,
};

const dateValue = {
    date: Joi.date().iso(),
    endDate: Joi.date().iso(),
};

const selectionValue = {
    value: Joi.array().items(validationSchemas.uuid),
};

const numberValue = {
    value: Joi.number(),
};

const customPropertyValidationSchemas = {
    name,
    description,
    type,
    isRequired,
    textMeta,
    dateMeta,
    selectionMeta,
    numberMeta,
    customSelectionOption,
    textValue,
    dateValue,
    selectionValue,
    numberValue,
};

export default customPropertyValidationSchemas;
