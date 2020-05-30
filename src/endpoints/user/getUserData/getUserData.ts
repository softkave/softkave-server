import { GetUserDataEndpoint } from "./types";

const getUserData: GetUserDataEndpoint = async (context, instData) => {
  const user = await context.session.getUser(context.models, instData);

  return {
    user,
  };
};

export default getUserData;
