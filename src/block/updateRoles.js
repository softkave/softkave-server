const canUserPerformAction = require("./canUserPerformAction");
const blockModel = require("../mongo/block");
const {
  validateBlock
} = require("./validator");
const {
  trimObject
} = require("../utils");

async function updateRoles({
  block,
  roles
}, req) {
  await validateBlock(block);
  await validateBlock({
    roles
  });

  trimObject(data, {
    "description": true
  });

  await canUserPerformAction(req, block, "UPDATE_ROLES");
  let labels = [];
  let push = [];
  roles.forEach(item => {
    item.role = item.role.toLowerCase();
    labels.push(item.role);
    push.push(item);
  });

  // TODO: see if you can implement using the result of canUserPerformAction
  // block.roles = roles;
  await blockModel.model
    .updateOne({
      _id: block.id
    }, {
      $pull: {
        "roles.role": {
          $in: labels
        }
      },
      $push: {
        roles: {
          $each: push
        }
      }
    }, )
    .lean()
    .exec();
}

module.exports = updateRoles;