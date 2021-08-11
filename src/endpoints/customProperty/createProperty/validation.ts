import Joi from "joi";
import { ParentResourceType } from "../../../models/system";
import { validationSchemas } from "../../../utilities/validationUtils";
import customPropertyValidationSchemas from "../validation";

const parentResourceTypeArray: ParentResourceType[] = [
    ParentResourceType.Organization,
    ParentResourceType.Board,
];

const parentResourceType = Joi.string().valid(parentResourceTypeArray);
const parent = Joi.object().keys({
    type: parentResourceType.required(),
    customId: validationSchemas.uuid.required(),
});

export const createPropertyJoiSchema = Joi.object().keys({
    parent: parent.required(),
    property: {
        name: customPropertyValidationSchemas.name.required(),
        description: customPropertyValidationSchemas.description,
        type: customPropertyValidationSchemas.type.required(),
        isRequired: customPropertyValidationSchemas.isRequired,
        meta: customPropertyValidationSchemas.meta.required(),
    },
});
