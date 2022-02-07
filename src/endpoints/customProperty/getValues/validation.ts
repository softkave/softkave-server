import Joi from "joi";
import endpointValidationSchemas from "../../validation";
import { customPropertyConstants } from "../constants";

export const getResourceSubscriptionsJoiSchema = Joi.object()
    .keys({
        parents: Joi.array()
            .items(endpointValidationSchemas.parent)
            .max(customPropertyConstants.maxFetchableValues)
            .required(),
    })
    .required();
