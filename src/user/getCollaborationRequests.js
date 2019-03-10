const getUserFromReq = require("../getUserFromReq");
const notificationModel = require("../mongo/notification");

async function getCollaborationRequests(nullArg, req) {
  const user = await getUserFromReq(req);
  const requests = await notificationModel.model
    .find({
      "to.email": user.email
    })
    .lean()
    .exec();

  return {
    requests
  };
}

module.exports = getCollaborationRequests;