import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import socketValidationSchemas from "../../socket/validation";
import { roomEndpointConstants } from "../constants";

export const subscribeJoiSchema = Joi.object().keys({
    rooms: Joi.array()
        .items(
            Joi.object().keys({
                customId: validationSchemas.uuid.required(),
                type: socketValidationSchemas.resourceType.required(),
            })
        )
        .max(roomEndpointConstants.maxSubscribeRooms)
        .unique("customId"),
});
