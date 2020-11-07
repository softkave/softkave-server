import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import socketValidationSchemas from "../validation";

export const subscribeJoiSchema = Joi.object().keys({
    items: Joi.array()
        .items(
            Joi.object().keys({
                customId: validationSchemas.uuid.required(),
                type: socketValidationSchemas.resourceType.required(),
            })
        )
        .max(50)
        .unique("customId"),
});
