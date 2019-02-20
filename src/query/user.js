const {
  blockFragment
} = require("./block");

const userExistsQuery = `
  query UserExistsQuery (email: String!) {
    user {
      userExists(email: $email) {
        errors {
          field
          message
        }
        userExists
      }
    }
  }
`;

const updateUserMutation = `
  mutation UpdateUserMutation($data: UpdateUserInput!) {
    user {
      updateUser(user: $user) {
        errors {
          field
          message
        }
      }
    }
  }
`;

const userPermissionFragment = `
  fragment userPermissionFragment {
    role
    level
    assignedAt
    assignedBy
    type
    blockId
  }
`;

const userLoginFragement = `
  ${userPermissionFragment}
  fragment userQueryResult on UserQueryResult {
    errors {
      field
      message
    }
    user {
      name
      email
      _id
      id
      createdAt
      lastNotificationCheckTime
      permissions {
        ...userPermissionFragment
      }
    }
    token
  }
`;

const userSignupMutation = `
  ${userLoginFragement}
  mutation UserSignupMutation ($user: UserSignupInput!) {
    user {
      signup (user: $user) {
        ...userQueryResult
      }
    }
  }
`;

const userLoginMutation = `
  ${userLoginFragement}
  mutation UserLoginMutation ($user: UserLoginInput!) {
    user {
      login (user: $user) {
        ...userQueryResult
      }
    }
  }
`;

const forgotPasswordMutation = `
  mutation UserForgotPasswordMutation ($email: String!) {
    user {
      forgotPassword {
        errors {
          field
          message
        }
      }
    }
  }
`;

const changePasswordMutation = `
  ${userLoginFragement}
  mutation UserChangePasswordMutation ($password: String!) {
    user {
      changePassword (password: $password) {
        ...userQueryResult
      }
    }
  }
`;

const changePasswordWithTokenMutation = `
  ${userLoginFragement}
  mutation UserChangeWithTokenPasswordMutation (
    $password: String!
  ) {
    user {
      changePasswordWithToken(password: $password) {
        ...userQueryResult
      }
    }
  }
`;

const getCollaborationRequestsQuery = `
  query GetCollaborationRequestsQuery {
    user {
      getCollaborationRequests {
        errors {
          ...errorFragment
        }
        requests {
          _id
          id
          from {
            userId
            name
            blockId
            blockName
          }
          createdAt
          body
          readAt
          to {
            email
          }
          response
          respondedAt
          permission {
            ...userPermissionFragment
          }
        }
      }
    }
  }
`;

const updateCollaborationRequestMutation = `
  ${userLoginFragement}
  mutation UpdateCollaborationRequestMutation (
    $id: String!, $data: UpdateCollabRequestInput!
  ) {
    user {
      updateCollaborationRequest (id: $id, data: $data) {
        errors {
          field
          message
        }
      }
    }
  }
`;

const respondToCollaborationRequestMutation = `
  ${blockFragment}
  mutation RespondToCollaborationRequestMutation (
    $id: String!, $response: String!
  ) {
    user {
      respondToCollaborationRequest (id: $id, response: $response) {
        errors {
          field
          message
        }
        block {
          ...blockFragment
        }
      }
    }
  }
`;

export {
  userSignupMutation,
  userLoginFragement,
  userLoginMutation,
  updateUserMutation,
  changePasswordMutation,
  forgotPasswordMutation,
  userPermissionFragment,
  userExistsQuery,
  updateCollaborationRequestMutation,
  changePasswordWithTokenMutation,
  respondToCollaborationRequestMutation,
  getCollaborationRequestsQuery
};