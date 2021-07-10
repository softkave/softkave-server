import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const removeCollaboratorJoiSchema = Joi.object()
    .keys({
        orgId: validationSchemas.uuid.required(),
        collaboratorId: validationSchemas.uuid.required(),
    })
    .required();
