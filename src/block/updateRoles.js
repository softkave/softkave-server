const findUserPermission = require("../user/findUserPermission");
// const canUserPerformAction = require("./canUserPerformAction");
// const getUserFromReq = require("../getUserFromReq");
const { RequestError } = require("../error");
const blockModel = require("../mongo/block");
const { getPermissionQuery } = require("./permission-utils");

async function updateRoles({ block, roles }, req) {
  // validate block & acl

  const role = await findUserPermission(req, block.id);
  let labels = [];
  let push = [];
  roles.forEach(item => {
    labels.push(item.role);
    push.push(item);
  });

  // implementing using array pull and push
  let r = await blockModel.model
    .findOneAndUpdate(
      {
        _id: block.id,
        acl: getPermissionQuery("UPDATE_ROLES", role)
      },
      {
        $pull: {
          "roles.role": { $in: labels }
        },
        $push: {
          roles: { $each: push }
        }
      },
      { fields: "_id" }
    )
    .lean()
    .exec();

  if (!r) {
    throw new RequestError("error", "permission denied");
  }

  // let result = await canUserPerformAction(
  //   block.id,
  //   "UPDATE_ROLES",
  //   role,
  //   "roles"
  // );
  // let inputRolesMap = {};
  // roles.forEach(item => {
  //   inputRolesMap[item.role] = item;
  // });

  // result.roles.forEach(item => {
  //   const inputRole = inputRolesMap[item.role];
  //   if (!!inputRole) {
  //     item.level = inputRole.level;
  //     delete inputRolesMap[item.role];
  //   }
  // });

  // for (const label in inputRolesMap) {
  //   const role = inputRolesMap[label];
  //   result.roles.push(role);
  // }

  // await result.save();
}

module.exports = updateRoles;
