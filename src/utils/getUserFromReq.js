const { RequestError } = require("./error");

async function getUserFromReq({ req, domain = "login", userModel }) {
  if (req.fetchedUser) {
    return req.fetchedUser;
  }

  if (!req.user || !req.user.customId || req.user.domain !== domain) {
    throw new RequestError("system.user", "invalid credentials");
  }

  const userTokenData = req.user;
  let user = null;
  let query = {
    customId: userTokenData.customId
  };

  // TODO: transform _id to id in all db fetch
  user = await userModel.findOne(query).exec();

  if (!user) {
    throw new RequestError("error", "permission denied");
  }

  req.user = user;
  req.fetchedUser = user;

  if (Array.isArray(user.changePasswordHistory)) {
    if (Array.isArray(userTokenData.changePasswordHistory)) {
      user.changePasswordHistory.forEach((time, i) => {
        if (time !== userTokenData.changePasswordHistory[i]) {
          throw new RequestError("system.user", "please login again");
        }
      });
    } else {
      throw new RequestError("system.user", "please login again");
    }
  }

  return user;
}

module.exports = getUserFromReq;
