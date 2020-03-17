import Joi from "joi";
import blockValidationSchemas from "../validation";

export const getBlockLandingPageJoiSchema = Joi.object()
  .keys({
    customId: blockValidationSchemas.blockID
  })
  .unknown(true);
