const findUserPermission = require("../user/findUserPermission");
// const canUserPerformAction = require("./canUserPerformAction");
// const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");
const blockModel = require("../mongo/block");
const { getPermissionQuery } = require("./permission-utils");

async function updateAcl({ block, acl }, req) {
  // validate block & acl

  const role = await findUserPermission(req, block.id);
  let actions = [];
  let push = [];
  acl.forEach(item => {
    actions.push(item.action);
    push.push(item);
  });

  // implementing using array pull and push
  let r = await blockModel.model
    .findOneAndUpdate(
      {
        _id: block.id,
        acl: getPermissionQuery("UPDATE_ACL", role)
      },
      {
        $pull: {
          "acl.action": { $in: actions }
        },
        $push: {
          acl: { $each: push }
        }
      },
      { fields: "_id" }
    )
    .lean()
    .exec();

  if (!r) {
    throw new RequestError("error", "permission denied");
  }

  // let result = await canUserPerformAction(block.id, "UPDATE_ACL", role, "acl");
  // let inputAclMap = {};
  // acl.forEach(item => {
  //   inputAclMap[item.action] = item;
  // });

  // result.acl.forEach(item => {
  //   const inputAcl = inputAclMap[item.action];
  //   if (!!inputAcl) {
  //     item.level = inputAcl.level;
  //   }
  // });

  // await result.save();
}

module.exports = updateAcl;
