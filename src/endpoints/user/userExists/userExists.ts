import { UserExistsEndpoint } from "./types";

const userExists: UserExistsEndpoint = async (context, instData) => {
  return context.user.userExists(context, instData.data.email);
};

export default userExists;
