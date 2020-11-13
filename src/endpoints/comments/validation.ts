import Joi from "joi";

const comment = Joi.string().allow("").max(1000).trim();

const commentValidationSchemas = {
    comment,
};

export default commentValidationSchemas;
