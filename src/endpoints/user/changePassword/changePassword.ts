import argon2 from "argon2";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../utils";
import UserToken from "../UserToken";
import { ChangePasswordEndpoint } from "./types";
import { changePasswordJoiSchema } from "./validation";

const changePassword: ChangePasswordEndpoint = async (context, instData) => {
  const result = validate(instData.data, changePasswordJoiSchema);
  const passwordValue = result.password;
  const user = await context.session.getUser(context.models, instData);
  const hash = await argon2.hash(passwordValue);

  await context.session.updateUser(context.models, instData, {
    hash,
    passwordLastChangedAt: new Date().toString(),
  });

  return {
    user,
    token: UserToken.newToken({ user, audience: [JWTEndpoints.Login] }),
  };
};

export default changePassword;
