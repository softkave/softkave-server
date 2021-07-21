import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";

export const updateRoomReadCounterJoiSchema = Joi.object().keys({
    organizationId: validationSchemas.uuid.required(),
    roomId: validationSchemas.uuid.required(),
    readCounter: Joi.date(),
});
