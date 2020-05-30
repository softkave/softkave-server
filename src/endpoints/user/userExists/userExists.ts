import { UserExistsEndpoint } from "./types";

const userExists: UserExistsEndpoint = async (context, instData) => {
  return context.user.userExists(context.models, instData.data.email);
};

export default userExists;
