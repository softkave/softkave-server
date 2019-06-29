const { errors } = require("./errorMessages");
const { constants: jwtConstants } = require("./jwt-constants");

async function getUserFromReq({
  req,
  userModel,
  domain = jwtConstants.domains.login
}) {
  if (req.fetchedUser) {
    return req.fetchedUser;
  }

  if (!req.user || !req.user.customId || req.user.domain !== domain) {
    throw errors.invalidCredentials;
  }

  const userTokenData = req.user;
  let user = null;
  let query = {
    customId: userTokenData.customId
  };

  // TODO: transform _id to id in all db fetch
  user = await userModel.model.findOne(query).exec();

  if (!user) {
    throw errors.permissionDenied;
  }

  req.user = user;
  req.fetchedUser = user;

  if (Array.isArray(user.changePasswordHistory)) {
    if (Array.isArray(userTokenData.changePasswordHistory)) {
      user.changePasswordHistory.forEach((time, i) => {
        if (time !== userTokenData.changePasswordHistory[i]) {
          throw errors.loginAgain;
        }
      });
    } else {
      throw errors.loginAgain;
    }
  }

  return user;
}

module.exports = getUserFromReq;
