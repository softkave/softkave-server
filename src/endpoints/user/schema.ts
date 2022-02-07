const userSchema = `
    type UserOrganization {
        customId: String
    }

    type User {
        customId: String
        name: String
        email: String
        createdAt: String
        rootBlockId: String
        orgs: [UserOrganization]
        color: String
        notificationsLastCheckedAt: String
    }

    input UserSignupInput {
        name: String!
        email: String!
        password: String!
        color: String!
    }

    input UserUpdateInput {
        name: String
        notificationsLastCheckedAt: String
        color: String
        email: String
    }

    type UserQueryResult {
        user: User
        token: String
        client: Client
        errors: [Error]
    }

    type UserExistsResult {
        errors: [Error]
        exists: Boolean
    }

    type UserQuery {
        userExists (email: String!) : UserExistsResult
        getUserData: UserQueryResult
    }

    type UserMutation {
        signup (user: UserSignupInput!) : UserQueryResult
        login (email: String!, password: String!) : UserQueryResult
        forganizationotPassword (email: String!) : ErrorOnlyResponse
        changePassword (
            currentPassword: String!, 
            password: String!
        ) : UserQueryResult
        updateUser (data: UserUpdateInput!): UserQueryResult
        changePasswordWithToken (password: String!) : UserQueryResult
    }
`;

export default userSchema;
