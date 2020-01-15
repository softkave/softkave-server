import Joi from "joi";
import UserModel from "../../mongo/user/UserModel";
import { validate } from "../../utils/joiUtils";
import { joiSchemas, validators } from "../../utils/validationUtils";
import userError from "./userError";

export interface IGetUserParameters {
  collaborator: string;
  userModel: UserModel;
  required?: boolean;
}

const getUserJoiSchema = Joi.object().keys({
  collaborator: joiSchemas.uuidSchema
});

async function getUser({
  collaborator,
  userModel,
  required
}: IGetUserParameters) {
  const result = validate({ collaborator }, getUserJoiSchema);
  collaborator = result.collaborator;
  const query = {
    customId: collaborator
  };

  const fetchedCollaborator = await userModel.model.findOne(query).exec();

  if (!fetchedCollaborator && required) {
    throw userError.collaboratorDoesNotExist;
  }

  return fetchedCollaborator;
}

export default getUser;
