import Joi from "joi";
import { sprintConstants } from "./constants";

const sprintDuration = Joi.string().allow(sprintConstants.durationOptions);

const sprintValidationSchemas = {
    sprintDuration,
};

export default sprintValidationSchemas;
