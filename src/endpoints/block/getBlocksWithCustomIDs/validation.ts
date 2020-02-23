import Joi from "joi";
import { blockConstants } from "../constants";

export const getBlocksWithIDsJoiSchema = Joi.object().keys({
  customIds: Joi.array()
    .items(Joi.string().uuid())
    .min(1)
    .max(blockConstants.maxGetBlocksWithCustomIDs)
    .unique()
});
