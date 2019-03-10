const canUserPerformAction = require("./canUserPerformAction");
const blockModel = require("../mongo/block");
const {
  validateBlock
} = require("./validator");
const { trimObject } = require("../utils");

async function updateAcl({
  block,
  acl
}, req) {
  await validateBlock(block);
  await validateBlock({
    acl
  });

  await canUserPerformAction(req, block, "UPDATE_ACL");
  let actions = [];
  let push = [];
  acl.forEach(item => {
    trimObject(item);
    actions.push(item.action);
    push.push(item);
  });

  // TODO: see if you can implement using the result of canUserPerformAction
  // block.acl = acl;
  await blockModel.model
    .updateOne({
      _id: block.id
    }, {
      $pull: {
        "acl.action": {
          $in: actions
        }
      },
      $push: {
        acl: {
          $each: push
        }
      }
    })
    .lean()
    .exec();
}

module.exports = updateAcl;