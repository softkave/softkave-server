import Joi from "joi";
import { regEx } from "../../utilities/validationUtils";
import { organizationConstants } from "./constants";

const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);
const name = Joi.string().trim().max(organizationConstants.maxNameLength);
const description = Joi.string()
    .allow(null, "")
    .max(organizationConstants.maxDescriptionLength)
    .trim();

const organizationValidationSchemas = {
    name,
    description,
    color,
};

export default organizationValidationSchemas;
