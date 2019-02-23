const { validateBlock } = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const collaborationRequestModel = require("../mongo/collaboration-request");
const findUserPermission = require("../user/findUserPermission");

async function getBlockCollabRequests({ block }, req) {
  // await validateBlock(block);

  const role = await findUserPermission(req, block.id);
  await canUserPerformAction(block.id, "READ_REQUESTS", role);
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
