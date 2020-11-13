import Joi from "joi";
import { noteConstants } from "./constants";

const name = Joi.string().trim().max(noteConstants.maxNameLength).lowercase();
const body = Joi.string().allow("").max(noteConstants.maxBodyLength).trim();

const noteValidationSchemas = {
    name,
    body,
};

export default noteValidationSchemas;
