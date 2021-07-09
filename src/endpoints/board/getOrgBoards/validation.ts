import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const getOrgBoardsJoiSchema = Joi.object().keys({
    orgId: validationSchemas.uuid.required(),
});
