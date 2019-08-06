import jwtConstants from "../../utils/jwtConstants";
import changePassword, { IChangePasswordParameters } from "./changePassword";
import userError from "./userError";

// TODO: define tokenData
export interface IChangePasswordWithTokenParameters
  extends IChangePasswordParameters {
  tokenData: any;
}

// TODO: write joi validation

async function changePasswordWithToken(
  arg: IChangePasswordWithTokenParameters
) {
  const { tokenData } = arg;

  if (tokenData && tokenData.domain !== jwtConstants.domains.changePassword) {
    throw userError.invalidCredentials;
  }

  return await changePassword(arg);
}

export default changePasswordWithToken;
