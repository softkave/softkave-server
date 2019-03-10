const blockModel = require("../mongo/block");
const {
  validateBlock
} = require("./validator");
const canUserPerformAction = require("./canUserPerformAction");
const {
  trimObject
} = require("../utils");

async function updateBlock({
  block,
  data
}, req) {
  await validateBlock(block);
  await validateBlock(data);
  trimObject(data, {
    "description": true
  });

  let actions = ["UPDATE"];

  if (data.acl) {
    actions.push("UPDATE_ACL");
  }

  if (data.roles) {
    actions.push("UPDATE_ROLES");
  }

  await canUserPerformAction(req, block, actions);
  data.updatedAt = Date.now();
  await blockModel.model.updateOne({
      _id: block.id
    },
    data
  );
}

module.exports = updateBlock;