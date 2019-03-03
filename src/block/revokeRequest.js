const collaborationRequestModel = require("../mongo/collaboration-request");
const { validateBlock } = require("./validator");
const { RequestError } = require("../error");
const canUserPerformAction = require("./canUserPerformAction");
const findUserPermission = require("../user/findUserPermission");
const { validateUUID } = require("../validation-utils");

async function revokeRequest({ block, request }, req) {
  await validateBlock(block);
  validateUUID(request);

  const role = await findUserPermission(req, block.id);
  await canUserPerformAction(block.id, "REVOKE_REQUEST", role);
  let r = await collaborationRequestModel.model
    .findOneAndUpdate(
      {
        _id: request
      },
      { $push: { statusHistory: { status: "revoked", date: Date.now() } } },
      { fields: "_id" }
    )
    .lean()
    .exec();

  if (!r) {
    throw new RequestError("error", "request does not exist");
  }

  //send notification to the recipient
}

module.exports = revokeRequest;
