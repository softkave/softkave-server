const {
  RequestError
} = require("../error");
// const roleModel = require("../mongo/role");
const blockModel = require("../mongo/block");
const getUserFromReq = require("../getUserFromReq");
const {
  indexArr
} = require("../utils");

// async function canUserPerformAction(req, blockId, action, projection = "_id parents") {
//   if (projection.indexOf("_id") === -1) {
//     projection += " _id";
//   }

//   if (projection.indexOf("parents") === -1) {
//     projection += " parents";
//   }

//   const user = await getUserFromReq(req);
//   const block = await blockModel.model.findOne({
//     _id: blockId
//   }, projection).exec();

//   const roles = user.roles;
//   const parents = [...block.parents];
//   parents.reverse();
//   const ids = [block._id, ...parents];
//   const role = roles.find(role => {
//     let closestRoleIndex = ids.indexOf(role.blockId);
//     return closestRoleIndex !== -1;
//   });

//   if (role) {
//     let query = {
//       name: role.name,
//       "roles.action": {
//         $or: ["*", action]
//       }
//     };

//     let canPerform = !!(await roleModel.model.findOne(query, "_id").exec());

//     if (!canPerform) {
//       return block;
//     }
//   }

//   throw new RequestError("error", "permission denied");
// }

async function canUserPerformAction(req, block, action, projection = "", summary) {
  projection = projection || "";
  let projectionArr = projection.split();
  let projectionMap = indexArr(projectionArr, field => field);
  projectionMap["_id"] = 1;
  projectionMap["roles"] = 1;
  projectionMap["acl"] = 1;
  projection = Object.keys(projectionMap).join(" ");

  const blockId = block.id;
  const user = await getUserFromReq(req);
  let actions = Array.isArray(action) ? action : [action];
  // let actionsMap = indexArr(actions, action => action);
  // actions = Object.keys(actionsMap);
  // TODO: look for a way to query all acl, and permitted roles, through query
  // acl: $in: actions.map => { action, roles: closestRole | $in: userRoles }

  const result = await blockModel.model.findOne({
    _id: blockId,
    // TODO: look into reducing returned acl using $ operator
    // acl: {
    //   $in: actions
    // }
  }, projection).exec();

  if (result) {
    const roles = user.roles
    let role = null;
    const acl = result.acl;

    if (Array.isArray(result.roles) && result.roles.length > 0) {
      let blockRolesMap = indexArr(result.roles, role => role.role);
      role = roles.find(role => {
        return !!blockRolesMap[role.role];
      });
    } else {
      const ids = [...block.parents];
      let idsMap = indexArr(ids, id => id);
      ids.reverse();
      ids.unshift(block.id);

      role = roles.find(role => {
        return !!idsMap[role.blockId];
      });
    }

    if (role && Array.isArray(acl) && acl.length > 0) {
      let aclMap = indexArr(acl, item => item.action);
      let allowedActions = [];
      let rejectedActions = [];
      actions.forEach(action => {
        let aclRoles = aclMap[action];

        if (Array.isArray(aclRoles)) {
          let canPerformAction = aclRoles.find(role => {
            return role.role === role;
          });

          if (canPerformAction) {
            allowedActions.push(action);
          } else {
            rejectedActions.push(action);
          }
        }
      });

      if (summary) {
        return {
          allowedActions,
          rejectedActions,
          permissionBlock: result
        };
      }

      if (rejectedActions.length === 0) {
        return result;
      }
    }
  }

  throw new RequestError("error", "permission denied");
}

module.exports = canUserPerformAction;