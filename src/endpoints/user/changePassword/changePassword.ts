import argon2 from "argon2";
import { getDate } from "../../../utilities/fns";
import getId from "../../../utilities/getId";
import { validate } from "../../../utilities/joiUtils";
import { JWTEndpoints } from "../../utils";
import UserToken from "../UserToken";
import { ChangePasswordEndpoint } from "./types";
import { changePasswordJoiSchema } from "./validation";

const changePassword: ChangePasswordEndpoint = async (context, instData) => {
  const result = validate(instData.data, changePasswordJoiSchema);
  const passwordValue = result.password;
  const user = await context.session.getUser(context, instData);
  const hash = await argon2.hash(passwordValue);

  await context.session.updateUser(context, instData, {
    hash,
    passwordLastChangedAt: getDate(),
  });

  return {
    user,
    token: UserToken.newToken({
      user,
      audience: [JWTEndpoints.Login],
      clientId: getId(),
    }),
  };
};

export default changePassword;
