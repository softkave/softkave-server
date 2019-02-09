const getUserFromReq = require("../getUserFromReq");
const collaborationRequestModel = require("../mongo/collaboration-request");

async function getCollaborationRequests(nullArg, req) {
  const user = await getUserFromReq(req);
  const requests = await collaborationRequestModel.model
    .find({ "to.email": user.email })
    .lean()
    .exec();

  return { requests };
}

module.exports = getCollaborationRequests;
