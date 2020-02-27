import { validate } from "../../../utilities/joiUtils";
import { IUpdateUserContext } from "./types";
import { updateUserJoiSchema } from "./validation";

async function updateUser(context: IUpdateUserContext): Promise<void> {
  const data = validate(context.data, updateUserJoiSchema);

  // TODO: should we check if the user exists?
  await context.updateUser(data);
}

export default updateUser;
