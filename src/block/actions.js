const { arrToMap } = require("../utils");

const primaryActions = ["READ", "UPDATE", "DELETE"];

const orgActions = [
  "CREATE_GROUP",
  "CREATE_PROJECT",
  "CREATE_TASK",
  "CREATE_INFO_CARD"
];

const projectActions = ["CREATE_GROUP", "CREATE_TASK", "CREATE_INFO_CARD"];

const taskActions = [
  "TOGGLE"
  // "ASSIGN_TASK", "UNASSIGN_TASK"
];

const groupActions = ["CREATE_PROJECT", "CREATE_TASK", "CREATE_INFO_CARD"];

const collaborationActions = [
  "SEND_REQUEST",
  "UPDATE_REQUEST",
  "READ_REQUESTS",
  "REVOKE_REQUEST",
  "CREATE_ROLE",
  "UPDATE_ROLES",
  "DELETE_ROLE",
  // "READ_ROLES",
  "UPDATE_ACL"
  // "REMOVE_COLLABORATOR",
  // "READ_COLLABORATORS",
  // "READ_BENCH",
  // "ASSIGN_ROLE",
  // "REVOKE_ROLE",
];

const actions = [
  ...primaryActions,
  ...taskActions,
  ...groupActions,
  ...orgActions,
  ...collaborationActions,
  ...projectActions
];

const actionsMap = arrToMap(actions);

module.exports = {
  primaryActions,
  taskActions,
  groupActions,
  collaborationActions,
  orgActions,
  projectActions,
  actions,
  actionsMap
};
