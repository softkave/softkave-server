const { validateBlock } = require("./validator");
const { canUserPerformAction } = require("../user/canUserPerformAction");
const collaborationRequestModel = require("../mongo/collaboration-request");

async function getBlockCollabRequests({ block }, req) {
  await validateBlock(block);
  await canUserPerformAction(req, "READ_COLLABORATION_REQUESTS", block.id);
  let requests = await collaborationRequestModel.model
    .find({
      "from.blockId": block.id
    })
    .lean()
    .exec();

  return {
    requests
  };
}

module.exports = getBlockCollabRequests;
