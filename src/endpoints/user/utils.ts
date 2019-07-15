import { IUser, IUserRole } from "./user";

function addEntryToPasswordDateLog(arr: number[]) {
  arr.push(Date.now());

  if (arr.length > 5) {
    arr.shift();
  }

  return arr;
}

function userRoleIsUpgraded(user: IUser) {
  if (Array.isArray(user.roles)) {
    return true;
  }

  return false;
}

function findRoleIndex(user: IUser, orgID: string) {
  return Array.isArray(user.roles)
    ? user.roles.findIndex(role => role.orgId === orgID)
    : null;
}

function findRole(user: IUser, orgID: string) {
  return Array.isArray(user.roles)
    ? user.roles.find(role => role.orgId === orgID)
    : null;
}

function areRolesTheSame(roleA: IUserRole, roleB: IUserRole) {
  return roleA.roleName === roleB.roleName;
}

function getOrgIDs(user: IUser) {
  if (userRoleIsUpgraded(user)) {
    return [...user.orgs, user.rootBlockId];
  }

  return user.roles.reduce((accumulator, role) => {
    accumulator.push(role.orgId);
    return accumulator;
  }, []);
}

export {
  addEntryToPasswordDateLog,
  userRoleIsUpgraded,
  findRole,
  getOrgIDs,
  findRoleIndex,
  areRolesTheSame
};
