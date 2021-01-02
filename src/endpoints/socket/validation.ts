import Joi from "joi";
import { SystemResourceType } from "../../models/system";

const resourceType = Joi.string()
    .lowercase()
    .valid([
        SystemResourceType.Board,
        SystemResourceType.Note,
        SystemResourceType.Org,
        SystemResourceType.Room,
    ]);

const socketValidationSchemas = {
    resourceType,
};

export default socketValidationSchemas;
