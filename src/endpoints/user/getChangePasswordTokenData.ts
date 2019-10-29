import isJWT from "validator/lib/isJWT";
import UserModel from "../../mongo/user/UserModel";
import OperationError from "../../utils/OperationError";
import decodeToken from "./decodeToken";
import { IChangePasswordTokenData } from "./forgotPassword";
import { userErrorFields, userErrorMessages } from "./userError";

const invalidTokenError = new OperationError(
  userErrorFields.invalidToken,
  userErrorMessages.invalidToken,
  "token"
);

const validateTokenLength = (token: string) => {
  const length = Buffer.byteLength(token, "base64") / 1024;

  if (length > 4) {
    throw invalidTokenError;
  }
};

export interface IGetChangePasswordTokenDataPasswordParameters {
  token: string;
  userModel: UserModel;
}

export interface IGetChangePasswordTokenDataPasswordResult {
  email: string;
  issuedAt: number;
  expires: number;
}

// TODO: Maybe change to getTokenStatus and
// Validate token IDs with user's change password token IDs history
async function getChangePasswordTokenData(
  props: IGetChangePasswordTokenDataPasswordParameters
): Promise<IGetChangePasswordTokenDataPasswordResult> {
  validateTokenLength(props.token);

  if (!isJWT(props.token)) {
    throw invalidTokenError;
  }

  const tokenData = decodeToken(props.token) as IChangePasswordTokenData;
  const user = await props.userModel.model
    .findOne({
      email: tokenData.email
    })
    .exec();

  if (!user) {
    throw invalidTokenError;
  }

  return {
    email: tokenData.email,
    issuedAt: tokenData.iat * 1000,
    expires: tokenData.exp * 1000
  };
}

export default getChangePasswordTokenData;
