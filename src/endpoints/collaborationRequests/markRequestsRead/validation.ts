import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { collaborationRequestsConstants } from "../constants";

export const markNotificationsReadJoiSchema = Joi.object()
    .keys({
        notifications: Joi.array()
            .items(validationSchemas.uuid.required())
            .max(collaborationRequestsConstants.maxMarkNotificationsReadNum)
            .required(),
    })
    .required();
