import UserModel from "../../mongo/user/UserModel";
import { validators } from "../../utils/validation-utils";
import userError from "./userError";

export interface IGetUserParameters {
  collaborator: string;
  userModel: UserModel;
  required?: boolean;
}

async function getUser({
  collaborator,
  userModel,
  required
}: IGetUserParameters) {
  collaborator = validators.validateUUID(collaborator);
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
