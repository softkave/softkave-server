import {UserExistsEndpoint} from './types';

const userExists: UserExistsEndpoint = async (context, reqData) => {
  const exists = await context.user.userExists(context, reqData.data!.email);
  return {exists};
};

export default userExists;
