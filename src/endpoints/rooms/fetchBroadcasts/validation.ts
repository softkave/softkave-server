import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { roomEndpointConstants } from "../constants";

export const fetchBroadcastsJoiSchema = Joi.object().keys({
    from: Joi.date().required(),
    rooms: Joi.array()
        .items(validationSchemas.uuid)
        .min(roomEndpointConstants.minFetchBroadcastRooms)
        .max(roomEndpointConstants.maxFetchBroadcastRooms)
        .required(),
});
