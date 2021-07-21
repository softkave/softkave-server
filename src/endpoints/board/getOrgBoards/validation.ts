import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrganizationBoardsJoiSchema = Joi.object()
    .keys({
        organizationId: validationSchemas.uuid.required(),
    })
    .required();
