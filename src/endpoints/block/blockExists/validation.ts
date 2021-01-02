import Joi from "joi";
import { BlockType } from "../../../mongo/block/definitions";
import blockValidationSchemas from "../validation";

export const blockExistsJoiSchema = Joi.object().keys({
    name: blockValidationSchemas.name.lowercase(),
    type: blockValidationSchemas.fullBlockType,
    parent: blockValidationSchemas.parent.when("type", {
        is: Joi.string().not([BlockType.Org, BlockType.Root]),
        then: Joi.required(),
    }),
    rootBlockId: blockValidationSchemas.parent.when("type", {
        is: Joi.string().not([BlockType.Org, BlockType.Root]),
        then: Joi.required(),
    }),
});
