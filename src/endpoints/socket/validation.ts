import Joi from "joi";
import { SystemResourceType } from "../../models/system";

const resourceType = Joi.string()
    .lowercase()
    .valid(
        SystemResourceType.Board,
        SystemResourceType.Note,
        SystemResourceType.Organization,
        SystemResourceType.Room
    );

const incomingEventData = Joi.object()
    .keys({
        token: Joi.string().required(),
        clientId: Joi.string().required(),
        data: Joi.any(),
    })
    .required();

const socketValidationSchemas = {
    resourceType,
    incomingEventData,
};

export default socketValidationSchemas;
