import { ClientType } from "../../../models/system";
import { getDateString } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { JWTEndpoint } from "../../types";
import { fireAndForgetPromise } from "../../utils";
import changePassword from "../changePassword/changePassword";
import { CredentialsExpiredError, InvalidCredentialsError } from "../errors";
import { ChangePasswordWithTokenEndpoint } from "./types";

const changePasswordWithToken: ChangePasswordWithTokenEndpoint = async (
  context,
  instData
) => {
  const tokenData = await context.session.getTokenData(
    context,
    instData,
    JWTEndpoint.ChangePassword
  );

  if (
    !context.token.containsAudience(
      context,
      tokenData,
      JWTEndpoint.ChangePassword
    )
  ) {
    throw new InvalidCredentialsError();
  }

  const incomingTokenData = instData.incomingTokenData;

  if (Date.now() > incomingTokenData.exp * 1000) {
    throw new CredentialsExpiredError();
  }

  const user = await context.user.assertGetUserById(context, tokenData.userId);
  instData.user = user;
  let client = await context.session.tryGetClient(context, instData);

  if (!client) {
    client = await context.client.saveClient(context, {
      clientId: getNewId(),
      createdAt: getDateString(),
      clientType: ClientType.Browser,
      users: [],
    });
  }

  instData.client = client;
  const result = await changePassword(context, instData);
  fireAndForgetPromise(
    context.token.deleteTokenById(context, incomingTokenData.sub.id)
  );

  return result;
};

export default changePasswordWithToken;
