const getUserFromReq = require("../getUserFromReq");
const collaborationRequestModel = require("../mongo/collaboration-request");
const { RequestError } = require("../error");
const blockModel = require("../mongo/block");
const addUserPermission = require("./addUserPermission");
const { validateMongoId } = require("../validation-utils");

async function respondToCollaborationRequest({ id, response }, req) {
  validateMongoId(id);
  let user = await getUserFromReq(req);
  response = response.toUpperCase();
  let request = await collaborationRequestModel.model
    .findOne(
      { _id: id, "to.email": user.email },
      {
        response,
        respondedAt: Date.now()
      },
      { lean: true, fields: "_id permission from.blockId" }
    )
    .exec();

  if (!request) {
    throw new RequestError("error", "request does not exist.");
  }

  if (response === "ACCEPTED") {
    let block = await blockModel.model
      .findOne({ _id: request.from.blockId })
      .lean()
      .exec();

    try {
      await addUserPermission(req, request.permission);
    } catch (error) {
      collaborationRequestModel
        .newModel()
        .updateOne(
          { _id: id },
          {
            response: null,
            respondedAt: null
          }
        )
        .save();

      console.error(error);
      throw new RequestError("error", "an error occurred.");
    }

    return {
      block
    };
  }
}

module.exports = respondToCollaborationRequest;
