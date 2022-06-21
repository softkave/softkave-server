import argon2 from "argon2";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { clientToClientUserView } from "../../clients/utils";
import { CURRENT_USER_TOKEN_VERSION } from "../../contexts/TokenContext";
import { JWTEndpoint } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import { getPublicUserData } from "../utils";
import { ChangePasswordEndpoint } from "./types";
import { changePasswordJoiSchema } from "./validation";

const changePassword: ChangePasswordEndpoint = async (context, instData) => {
  const result = validate(instData.data, changePasswordJoiSchema);
  const newPassword = result.password;
  let user = await context.session.getUser(context, instData);
  let client = await context.session.getClient(context, instData);
  const hash = await argon2.hash(newPassword);
  user = await context.user.updateUserById(context, user.customId, {
    hash,
    passwordLastChangedAt: getDateString(),
  });

  instData.user = user;
  context.socket.removeUserSocketEntries(context, user.customId);
  delete instData.tokenData;
  delete instData.incomingTokenData;
  fireAndForgetPromise(
    context.token.deleteTokensByUserId(context, user.customId)
  );

  const tokenData = await context.token.saveToken(context, {
    clientId: client.clientId,
    customId: getNewId(),
    audience: [JWTEndpoint.Login],
    issuedAt: getDateString(),
    userId: user.customId,
    version: CURRENT_USER_TOKEN_VERSION,
  });

  instData.tokenData = tokenData;
  client = await context.client.updateUserEntry(
    context,
    instData,
    client.clientId,
    user.customId,
    {
      userId: user.customId,
      tokenId: tokenData.customId,
      isLoggedIn: true,
    }
  );

  instData.client = client;
  const token = context.token.encodeToken(context, tokenData.customId);

  return {
    token,
    client: clientToClientUserView(instData.client, user.customId),
    user: getPublicUserData(user),
  };
};

export default changePassword;
