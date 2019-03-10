const userModel = require("./mongo/user").model;
const {
  RequestError
} = require("./error");

async function getUserFromReq(req /*, additionalQuery, refetch*/ ) {
  if (!req.user || !req.user.id) {
    throw new RequestError("user", "invalid credentials");
  }

  if (req.fetchedUser /*&& !refetch*/ ) {
    return req.fetchedUser;
  }

  const userTokenData = req.user;
  let user = null;
  let query = {
    /*...additionalQuery,*/
    _id: userTokenData.id
  };

  // TODO: transform _id to id in all db fetch
  user = await userModel.findOne(query).exec();
  if (!user) {
    throw new RequestError("error", "permission denied.");
  }

  req.user = user;
  req.fetchedUser = user;
  if (Array.isArray(user.changePasswordHistory)) {
    if (Array.isArray(userTokenData.changePasswordHistory)) {
      user.changePasswordHistory.forEach((time, i) => {
        if (time !== userTokenData.changePasswordHistory[i]) {
          throw new RequestError("user", "please login again.");
        }
      });
    } else {
      throw new RequestError("user", "please login again.");
    }
  }

  return user;
}

module.exports = getUserFromReq;