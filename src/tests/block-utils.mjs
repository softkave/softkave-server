import { getDataFromObject } from "./utils.mjs";
import query from "./utils.mjs";
import {
  addBlockMutation,
  addCollaboratorsMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  getBlocksWithCustomIDsQuery,
  getCollaboratorsQuery,
  getCollabRequestsQuery,
  getRoleBlocksQuery,
  getTasksAssignedToUserQuery,
  removeCollaboratorMutation,
  revokeRequestMutation,
  transferBlockMutation,
  updateBlockMutation
} from "./block-schema.mjs";

export function addBlock(block, token) {
  const fields = [
    "name",
    "customId",
    "description",
    "expectedEndAt",
    "color",
    "type",
    "parent",
    "rootBlockID",
    "priority",
    "taskCollaborationData",
    "taskCollaborators",
    "subTasks",
    "groups",
    "projects",
    "tasks",
    "groupTaskContext",
    "groupProjectContext"
  ];

  return query({
    token,
    query: addBlockMutation,
    variables: { block: getDataFromObject(block, fields) },
    path: "data.block.addBlock"
  });
}

export function updateBlock(block, data, token) {
  const dataFields = [
    "name",
    "description",
    "expectedEndAt",
    "color",
    "priority",
    "taskCollaborationData",
    "taskCollaborators",
    "parent",
    "groups",
    "projects",
    "tasks",
    "groupTaskContext",
    "groupProjectContext",
    "subTasks"
  ];

  return query({
    token,
    query: updateBlockMutation,
    variables: {
      customId: block.customId,
      data: getDataFromObject(data, dataFields)
    },
    path: "data.block.updateBlock"
  });
}

export function deleteBlock(block, token) {
  return query({
    token,
    query: deleteBlockMutation,
    variables: { customId: block.customId },
    path: "data.block.deleteBlock"
  });
}

export function getBlockChildren(block, typeList, token) {
  return query({
    token,
    query: getBlockChildrenQuery,
    variables: { typeList, customId: block.customId },
    path: "data.block.getBlockChildren"
  });
}

export function addCollaborators(block, collaborators, token) {
  const collaboratorFields = ["email", "body", "expiresAt", "customId"];
  return query({
    token,
    query: addCollaboratorsMutation,
    variables: {
      customId: block.customId,
      collaborators: collaborators.map(request =>
        getDataFromObject(request, collaboratorFields)
      )
    },
    path: "data.block.addCollaborators"
  });
}

export function removeCollaborator(block, collaborator, token) {
  return query({
    token,
    query: removeCollaboratorMutation,
    variables: {
      customId: block.customId,
      collaborator: collaborator.customId
    },
    path: "data.block.removeCollaborator"
  });
}

export function getCollaborators(block, token) {
  return query({
    token,
    query: getCollaboratorsQuery,
    variables: {
      customId: block.customId
    },
    path: "data.block.getBlockCollaborators"
  });
}

export function getCollabRequests(block, token) {
  return query({
    token,
    query: getCollabRequestsQuery,
    variables: {
      customId: block.customId
    },
    path: "data.block.getBlockCollaborationRequests"
  });
}

export function getRoleBlocks(token) {
  return query({
    token,
    query: getRoleBlocksQuery,
    variables: {},
    path: "data.block.getRoleBlocks"
  });
}

// export function toggleTask({ block, data }) {
//   return query(
//     null,
//     toggleTaskMutation,
//     {
//       data,
//       customId: block.customId
//     },
//     "data.block.toggleTask"
//   );
// }

export function revokeRequest(block, request, token) {
  return query({
    token,
    query: revokeRequestMutation,
    variables: {
      request: request.customId,
      customId: block.customId
    },
    path: "data.block.revokeCollaborationRequest"
  });
}

export function transferBlock(
  sourceBlock,
  draggedBlock,
  destinationBlock,
  dropPosition,
  groupContext,
  token
) {
  return query({
    token,
    query: transferBlockMutation,
    variables: {
      dropPosition,
      groupContext,
      sourceBlock,
      draggedBlock,
      destinationBlock
    },
    path: "data.block.transferBlock"
  });
}

export function getTasksAssignedToUser(token) {
  return query({
    token,
    query: getTasksAssignedToUserQuery,
    variables: {},
    path: "data.block.getAssignedTasks"
  });
}

export function getBlocksWithCustomIDs(customIds, token) {
  return query({
    token,
    query: getBlocksWithCustomIDsQuery,
    variables: { customIds },
    path: "data.block.getBlocksWithCustomIDs"
  });
}
