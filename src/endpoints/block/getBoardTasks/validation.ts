import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import blockValidationSchemas from "../validation";

export const getBlockChildrenJoiSchema = Joi.object().keys({
    blockId: validationSchemas.uuid.required(),
    typeList: blockValidationSchemas.blockTypesList,
});
