import Joi from "joi";
import { validationSchemas } from "../../../utilities/validationUtils";
import { collaborationRequestsConstants } from "../../collaborationRequest/constants";
import { accessControlConstants } from "../constants";
import accessControlValidationSchemas from "../validation";

const permissionGroups = Joi.array()
  .items(accessControlValidationSchemas.permissionGroupId)
  .unique()
  .max(accessControlConstants.maxPermissionGroups);

const users = Joi.array()
  .items(validationSchemas.uuid)
  .unique()
  .max(collaborationRequestsConstants.maxCollaborators);

export const updatePermissionInputJoiSchema = Joi.object().keys({
  permissionGroups,
  users,
});

const updatePermissionJoiSchema = Joi.object().keys({
  customId: validationSchemas.uuid.required(),
  data: updatePermissionInputJoiSchema.required(),
});

export const setPermissionsJoiSchema = Joi.object().keys({
  blockId: validationSchemas.uuid.required(),
  permissions: Joi.array()
    .items(updatePermissionJoiSchema)
    .unique("customId")
    .max(accessControlConstants.maxPermissions),
});
