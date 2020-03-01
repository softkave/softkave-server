import { errorFragment } from "./error";

const blockFragment = `
  fragment blockFragment on Block {
    customId
    name
    description
    priority
    expectedEndAt
    createdAt
    color
    updatedAt
    type
    parent
    rootBlockID
    createdBy
    tasks
    groups
    projects
    groupTaskContext
    groupProjectContext
    taskCollaborationData {
      collaborationType
      completedAt
      completedBy
    }
    taskCollaborators {
      userId
      assignedAt
      assignedBy
      completedAt
    }
    subTasks {
      customId
      description
      completedAt
      completedBy
    }
  }
`;

const addBlockMutation = `
  ${errorFragment}
  mutation AddBlockMutation ($block: AddBlockInput!) {
    block {
      addBlock (block: $block) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const updateBlockMutation = `
  ${errorFragment}
  mutation UpdateBlockMutation ($customId: String!, $data: UpdateBlockInput!) {
    block {
      updateBlock (customId: $customId, data: $data) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const deleteBlockMutation = `
  ${errorFragment}
  mutation DeleteBlockMutation ($customId: String!) {
    block {
      deleteBlock (customId: $customId) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const getRoleBlocksQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetRoleBlocksQuery {
    block {
      getRoleBlocks {
        errors {
          ...errorFragment
        }
        blocks {
          ...blockFragment
        }
      }
    }
  }
`;

const getBlockChildrenQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetBlockChildrenQuery ($customId: String!, $typeList: [String!]) {
    block {
      getBlockChildren (customId: $customId, typeList: $typeList) {
        errors {
          ...errorFragment
        }
        blocks {
          ...blockFragment
        }
      }
    }
  }
`;

const addCollaboratorsMutation = `
  ${errorFragment}
  mutation AddCollaborators (
    $customId: String!,
    $collaborators: [AddCollaboratorInput!]!
  ) {
    block {
      addCollaborators (customId: $customId, collaborators: $collaborators) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const getCollaboratorsQuery = `
  ${errorFragment}
  query GetBlockCollaboratorsQuery ($customId: String!) {
    block {
      getBlockCollaborators (customId: $customId) {
        errors {
          ...errorFragment
        }
        collaborators {
          name
          email
          customId
        }
      }
    }
  }
`;

const getCollabRequestsQuery = `
  ${errorFragment}
  query GetBlockCollaborationRequestsQuery ($customId: String!) {
    block {
      getBlockCollaborationRequests (customId: $customId) {
        errors {
          ...errorFragment
        }
        requests {
          customId
          from {
            userId
            name
            blockId
            blockName
            blockType
          }
          createdAt
          body
          readAt
          to {
            email
            userId
          }
          statusHistory {
            status
            date
          }
          sentEmailHistory {
            date
          }
          type
          root
        }
      }
    }
  }
`;

const removeCollaboratorMutation = `
  ${errorFragment}
  mutation RemoveCollaboratorsMutation ($customId: String!, $collaborator: String!) {
    block {
      removeCollaborator (customId: $customId, collaborator: $collaborator) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

// const toggleTaskMutation = `
//   ${errorFragment}
//   mutation ToggleTaskMutation ($customId: String!,  $data: Boolean!) {
//     block {
//        toggleTask (customId: $customId, data: $data) {
//         errors {
//           ...errorFragment
//         }
//       }
//     }
//   }
// `;

const revokeRequestMutation = `
  ${errorFragment}
  mutation RevokeCollaborationRequestMutation ($customId: String!, $request: String!) {
    block {
      revokeCollaborationRequest (customId: $customId, request: $request) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const transferBlockMutation = `
  ${errorFragment}
  mutation DragAndDropMutation (
    $sourceBlock: String!,
    $draggedBlock: String!,
    $destinationBlock: String!,
    $dropPosition: Float,
    $groupContext: String
  ) {
    block {
      transferBlock (
        sourceBlock: $sourceBlock,
        draggedBlock: $draggedBlock,
        destinationBlock: $destinationBlock,
        dropPosition: $dropPosition,
        groupContext: $groupContext
      ) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const getBlocksWithCustomIDsQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetBlocksWithCustomIdsQuery ($customIds: [String!]!) {
    block {
      getBlocksWithCustomIds (customIds: $customIds) {
        errors {
          ...errorFragment
        }
        blocks {
          ...blockFragment
        }
      }
    }
  }
`;

export const getTasksAssignedToUserQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetTasksAssignedToUserQuery {
    block {
      getAssignedTasks {
        errors {
          ...errorFragment
        }
        blocks {
          ...blockFragment
        }
      }
    }
  }
`;

export {
  addBlockMutation,
  updateBlockMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  blockFragment,
  addCollaboratorsMutation,
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getRoleBlocksQuery,
  removeCollaboratorMutation,
  // toggleTaskMutation,
  revokeRequestMutation,
  transferBlockMutation
};
