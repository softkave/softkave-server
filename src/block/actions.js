const primaryActions = ["READ", "UPDATE", "DELETE"];

const orgActions = [
  "CREATE_GROUP",
  "CREATE_PROJECT",
  "CREATE_TASK",
  "CREATE_INFO_CARD"
];

const projectActions = ["CREATE_GROUP", "CREATE_TASK", "CREATE_INFO_CARD"];

const taskActions = ["TOGGLE"];

const groupActions = ["CREATE_PROJECT", "CREATE_TASK", "CREATE_INFO_CARD"];

const collaborationActions = [
  "SEND_REQUEST",
  "UPDATE_REQUEST",
  "READ_REQUESTS",
  "CREATE_ROLE",
  "UPDATE_ROLE",
  "DELETE_ROLE",
  // "READ_ROLES",
  "UPDATE_ACL",
  "DELETE_ACL"
  // "READ_COLLABORATORS"
];

module.exports = {
  primaryActions,
  taskActions,
  groupActions,
  collaborationActions,
  orgActions,
  projectActions
};
