import Joi from "joi";
import { chatConstants } from "./constants";

const message = Joi.string().max(chatConstants.maxMessageLength).trim();

const chatValidationSchemas = {
    message,
};

export default chatValidationSchemas;
