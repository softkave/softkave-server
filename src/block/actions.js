const {
  arrToMap
} = require("../utils");

const primaryActions = ["CREATE", "READ", "UPDATE", "DELETE"];

const collaborationActions = [
  "SEND_REQUEST",
  "UPDATE_REQUEST",
  "READ_REQUESTS",
  "REVOKE_REQUEST",
  "REMOVE_COLLABORATOR",
  "READ_BENCH",
  "UPDATE_ACL",
  "UPDATE_ROLES",
  "ASSIGN_ROLE",
  "REVOKE_ROLE",
];

const taskActions = [
  ...primaryActions,
  "TOGGLE_TASK",
  "ASSIGN_TASK",
  "UNASSIGN_TASK",

];

const projectActions = [
  ...taskActions,
  ...collaborationActions,
  "CREATE_TASK",
  "READ_TASK",
  "DELETE_TASK",
  "UPDATE_TASK",
  "CREATE_GROUP",
  "READ_GROUP",
  "DELETE_GROUP",
  "UPDATE_GROUP"
];

const groupActions = [
  ...taskActions,
  ...collaborationActions,
  "CREATE_TASK",
  "READ_TASK",
  "DELETE_TASK",
  "UPDATE_TASK",
  "CREATE_PROJECT",
  "READ_PROJECT",
  "DELETE_PROJECT",
  "UPDATE_PROJECT"
];

const orgActions = [
  ...groupActions,
  "CREATE_GROUP",
];

const actions = [...orgActions, "CREATE_ORG"];
const actionsMap = arrToMap(actions);
const taskActionsMap = arrToMap(taskActions);
const groupActionsMap = arrToMap(groupActions);
const projectActionsMap = arrToMap(projectActions);
const orgActionsMap = arrToMap(orgActions);

module.exports = {
  collaborationActions,
  taskActions,
  groupActions,
  projectActions,
  orgActions,
  actions,
  actionsMap,
  taskActionsMap,
  groupActionsMap,
  projectActionsMap,
  orgActionsMap
};