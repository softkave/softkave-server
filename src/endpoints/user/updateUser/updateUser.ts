import { validate } from "../../../utilities/joiUtils";
import { UpdateUserEndpoint } from "./types";
import { updateUserJoiSchema } from "./validation";

const updateUser: UpdateUserEndpoint = async (context, instData) => {
  const data = validate(instData.data, updateUserJoiSchema);

  await context.session.updateUser(context.models, instData, data);
};

export default updateUser;
