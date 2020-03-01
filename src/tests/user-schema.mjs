import { blockFragment } from "./block-utils.mjs";
import { errorFragment } from "./error";

export const userExistsQuery = `
  ${errorFragment}
  query UserExistsQuery (email: String!) {
    user {
      userExists(email: $email) {
        errors {
          ...errorFragment
        }
        userExists
      }
    }
  }
`;

export const updateUserMutation = `
  ${errorFragment}
  mutation UpdateUserMutation($data: UpdateUserInput!) {
    user {
      updateUser(user: $user) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const userLoginFragement = `
  ${errorFragment}
  fragment userQueryResult on UserQueryResult {
    errors {
      ...errorFragment
    }
    user {
      name
      email
      customId
      createdAt
      lastNotificationCheckTime
      color
      # roles
      orgs
    }
    token
  }
`;

export const userSignupMutation = `
  ${userLoginFragement}
  mutation UserSignupMutation ($user: UserSignupInput!) {
    user {
      signup (user: $user) {
        ...userQueryResult
      }
    }
  }
`;

export const userLoginMutation = `
  ${userLoginFragement}
  mutation UserLoginMutation ($email: String!, $password: String!) {
    user {
      login (email: $email, password: $password) {
        ...userQueryResult
      }
    }
  }
`;

export const forgotPasswordMutation = `
  ${errorFragment}
  mutation UserForgotPasswordMutation ($email: String!) {
    user {
      forgotPassword(email: $email) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const changePasswordMutation = `
  ${userLoginFragement}
  mutation UserChangePasswordMutation ($password: String!) {
    user {
      changePassword (password: $password) {
        ...userQueryResult
      }
    }
  }
`;

export const changePasswordWithTokenMutation = `
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

export const getCollaborationRequestsQuery = `
  ${errorFragment}
  query GetCollaborationRequestsQuery {
    user {
      getCollaborationRequests {
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

export const getUserDataQuery = `
  ${userLoginFragement}
  query GetUserDataQuery {
    user {
      getUserData {
        ...userQueryResult
      }
    }
  }
`;

export const updateCollaborationRequestMutation = `
  ${errorFragment}
  mutation UpdateCollaborationRequestMutation (
    $customId: String!, $data: UpdateCollaborationRequestInput!
  ) {
    user {
      updateCollaborationRequest (customId: $customId, data: $data) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const respondToCollaborationRequestMutation = `
  ${blockFragment}
  ${errorFragment}
  mutation RespondToCollaborationRequestMutation (
    $customId: String!, $response: String!
  ) {
    user {
      respondToCollaborationRequest (customId: $customId, response: $response) {
        errors {
          ...errorFragment
        }
        block {
          ...blockFragment
        }
      }
    }
  }
`;

export const getSessionDetailsQuery = `
  ${errorFragment}
  query GetSessionDetailsQuery {
    user {
      getSessionDetails {
        errors {
          ...errorFragment
        }
        notificationsCount
        organizationsCount
        assignedTasksCount
      }
    }
  }
`;
