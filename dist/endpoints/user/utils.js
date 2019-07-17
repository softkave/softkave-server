"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addEntryToPasswordDateLog(arr) {
    arr.push(Date.now());
    if (arr.length > 5) {
        arr.shift();
    }
    return arr;
}
exports.addEntryToPasswordDateLog = addEntryToPasswordDateLog;
function userRoleIsUpgraded(user) {
    if (Array.isArray(user.roles)) {
        return true;
    }
    return false;
}
exports.userRoleIsUpgraded = userRoleIsUpgraded;
function findRoleIndex(user, orgID) {
    return Array.isArray(user.roles)
        ? user.roles.findIndex(role => role.orgId === orgID)
        : null;
}
exports.findRoleIndex = findRoleIndex;
function findRole(user, orgID) {
    return Array.isArray(user.roles)
        ? user.roles.find(role => role.orgId === orgID)
        : null;
}
exports.findRole = findRole;
function areRolesTheSame(roleA, roleB) {
    return roleA.roleName === roleB.roleName;
}
exports.areRolesTheSame = areRolesTheSame;
function getOrgIDs(user) {
    if (userRoleIsUpgraded(user)) {
        return [...user.orgs, user.rootBlockId];
    }
    return user.roles.reduce((accumulator, role) => {
        accumulator.push(role.orgId);
        return accumulator;
    }, []);
}
exports.getOrgIDs = getOrgIDs;
//# sourceMappingURL=utils.js.map