import Joi from "joi";
import sprintValidationSchemas from "../validation";

export const blockExistsJoiSchema = Joi.object().keys({
    name: sprintValidationSchemas.lowerCasedName,
    type: sprintValidationSchemas.fullBlockType,
    parent: sprintValidationSchemas.parent,
});
