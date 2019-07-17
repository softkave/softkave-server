const blockActionsMap = {
  // task
  CREATE_TASK: "CREATE_TASK",
  READ_TASK: "READ_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  ASSIGN_TASK: "ASSIGN_TASK",
  TOGGLE_TASK: "TOGGLE_TASK",
  // TRANSFER_TASK: "TRANSFER_TASK",

  // group
  CREATE_GROUP: "CREATE_GROUP",
  READ_GROUP: "READ_GROUP",
  UPDATE_GROUP: "UPDATE_GROUP",
  DELETE_GROUP: " DELETE_GROUP",
  // TRANSFER_GROUP: "TRANSFER_GROUP",

  // project
  CREATE_PROJECT: "CREATE_PROJECT",
  READ_PROJECT: "READ_PROJECT",
  UPDATE_PROJECT: "UPDATE_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  // TRANSFER_PROJECT: "TRANSFER_PROJECT",

  // org
  // CREATE_ORG: "CREATE_ORG",
  READ_ORG: "READ_ORG",
  UPDATE_ORG: "UPDATE_ORG",
  DELETE_ORG: "DELETE_ORG",
  // TRANSFER_ORG: "TRANSFER_ORG",
  ADD_COLLABORATOR: "ADD_COLLABORATOR",
  REMOVE_COLLABORATOR: "REMOVE_COLLABORATOR",
  REVOKE_COLLABORATION_REQUEST: "REVOKE_COLLABORATION_REQUEST",
  ASSIGN_ROLE: "ASSIGN_ROLE",
  UPDATE_ROLES: "UPDATE_ROLES"
};

const blockActionsArray = Object.keys(blockActionsMap);

const CRUDActionsMap = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  TRANSFER: "TRANSFER"
};

const CRUDActionsArray = Object.keys(CRUDActionsMap);

export { blockActionsArray, blockActionsMap, CRUDActionsArray, CRUDActionsMap };
