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
  "TOGGLE_TASK",
  "ASSIGN_TASK",
  "UNASSIGN_TASK",
  "READ_TASK",
  "UPDATE_TASK",
  "DELETE_TASK"
];

const projectActions = [
  ...taskActions,
  ...collaborationActions,
  "CREATE_TASK",
  "CREATE_GROUP",
  "READ_GROUP",
  "DELETE_GROUP",
  "UPDATE_GROUP",
  "READ_PROJECT",
  "DELETE_PROJECT",
  "UPDATE_PROJECT"
];

const groupActions = [
  ...taskActions,
  ...collaborationActions,
  "CREATE_TASK",
  "CREATE_PROJECT",
  "READ_PROJECT",
  "DELETE_PROJECT",
  "UPDATE_PROJECT",
  "READ_GROUP",
  "DELETE_GROUP",
  "UPDATE_GROUP",
];

const orgActions = [
  ...groupActions,
  "CREATE_GROUP",
  "UPDATE_ORG",
  "DELETE_ORG",
  "READ_ORG"
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