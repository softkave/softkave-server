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
  // await validateBlock(block);
  // await validateBlock(data);
  trimObject(data, {
    "description": true
  });

  let actions = ["UPDATE"];

  if (data.acl) {
    actions.push("UPDATE_ACL");
    data.acl = data.acl.map(item => {
      return {
        action: item.action,
        roles: Array.isArray(item.roles) ? item.roles.map(role => role.toLowerCase()) : null
      };
    });
  }

  if (data.roles) {
    actions.push("UPDATE_ROLES");
    data.roles = data.roles.map(role => {
      return {
        role: role.role.toLowerCase(),
        hierarchy: role.hierarchy
      };
    });
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