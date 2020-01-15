import { IUserExistsContext } from "./types";

async function userExists(context: IUserExistsContext): Promise<boolean> {
  return context.doesUserExistInDatabase(context.data.email);
}

export default userExists;
