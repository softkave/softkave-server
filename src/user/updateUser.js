const {
  checkUser
} = require("../utils");
const userModel = require("../mongo/user");
const {
  RequestError
} = require("../error");
const {
  trimObject
} = require("../utils");

async function updateUser({
  data
}, req) {
  await checkUser(req);
  trimObject(data);

  let user = userModel.model
    .findOneAndUpdate({
      _id: req.user._id
    }, data, {
      lean: true,
      fields: "_id"
    })
    .exec();

  if (!user) {
    throw new RequestError("error", "user does not exist.");
  }
}

module.exports = updateUser;