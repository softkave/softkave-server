import Joi from "joi";
import { regEx } from "../../utilities/validationUtils";
import { orgConstants } from "./constants";

const color = Joi.string().trim().lowercase().regex(regEx.hexColorPattern);
const name = Joi.string().trim().max(orgConstants.maxNameLength);
const description = Joi.string()
    .allow([null, ""])
    .max(orgConstants.maxDescriptionLength)
    .trim();

const orgValidationSchemas = {
    name,
    description,
    color,
};

export default orgValidationSchemas;
