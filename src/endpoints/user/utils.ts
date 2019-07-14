function addEntryToPasswordDateLog(arr) {
  arr.push(Date.now());

  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}

function userRoleIsUpgraded(user) {
  if (Array.isArray(user.roles)) {
    return true;
  } else {
    return false;
  }
}

function findRoleIndex(user, orgId) {
  Array.isArray(user.roles)
    ? user.roles.findIndex(role => role.orgId === orgId)
    : null;
}

function findRole(user, orgId) {
  Array.isArray(user.roles)
    ? user.roles.find(role => role.orgId === orgId)
    : null;
}

function areRolesSame(roleA, roleB) {
  return roleA.roleName === roleB.roleName;
}

function getOrgIDs(user) {
  if (userRoleIsUpgraded(user)) {
    return [...user.orgs, user.rootBlockId];
  } else {
    return user.roles.reduce((accumulator, role) => {
      accumulator.push(role.orgId);
    }, []);
  }
}

module.exports = {
  addEntryToPasswordDateLog,
  userRoleIsUpgraded,
  findRole,
  getOrgIDs,
  findRoleIndex,
  areRolesSame
};
export {};
