import Joi from "joi";
import { sprintConstants } from "./constants";

const sprintDuration = Joi.string().allow(sprintConstants.durationOptions);

const name = Joi.string()
    .trim()
    .max(sprintConstants.maxNameLength)
    .lowercase()
    .disallow("backlog");

const sprintValidationSchemas = {
    sprintDuration,
    name,
};

export default sprintValidationSchemas;
