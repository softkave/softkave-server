const getUserFromReq = require("../getUserFromReq");
const collaborationRequestModel = require("../mongo/collaboration-request");
const { RequestError } = require("../error");
const { validateMongoId } = require("../validation-utils");

async function updateCollaborationRequest({ id, data }, req) {
  validateMongoId(id);
  const user = await getUserFromReq(req);
  let notification = await collaborationRequestModel.model
    .findOneAndUpdate(
      {
        _id: id,
        "to.email": user.email
      },
      data,
      { lean: true, fields: "_id" }
    )
    .exec();

  if (!notification) {
    throw new RequestError("error", "notification does not exist");
  }
}

module.exports = updateCollaborationRequest;
