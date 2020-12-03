const accessControlGraphQLSchema = `
    type Permission {
        customId: String
        action: String
        roles: [String]
        users: [String]
        resourceId: String
        resourceType: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
    }

    type Role {
        customId: String
        name: String
        description: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
        resourceId: String
        resourceType: String
    }

    input NewPermissionInput {
        action: String!
        roles: [String]!
        users: [String]!
        resourceType: String!
    }

    input UpdatePermissionInput {
        action: String
        roles: [String]
        users: [String]
        resourceType: String
    }

    input NewRoleInput {
        name: String!
        description: String
        resourceId: String!
        resourceType: String!
    }

    input UpdateRoleInput {
        name: String
        description: String
        resourceId: String
        resourceType: String
    }

    input SetPermissionsAddPermissionInput {
        tempId: String!
        data: NewPermissionInput!
    }

    input SetPermissionsUpdatePermissionInput {
        permissionId: String!
        data: UpdatePermissionInput!
    }

    input SetPermissionsInput {
        add: [SetPermissionsAddPermissionInput]
        update: [SetPermissionsUpdatePermissionInput]
        remove: [String]
    }

    input SetRolesAddRoleInput {
        tempId: String!
        data: NewRoleInput!
    }

    input SetRolesUpdateRoleInput {
        roleId: String!
        data: UpdateRoleInput!
    }

    input SetRolesInput {
        add: [SetRolesAddRoleInput]
        update: [SetRolesUpdateRoleInput]
        remove: [String]
    }

    type GetPermissionsResult {
        permissions: IPublicPermissionData[];
        errors: [Error]
    }

    type GetRolesResult {
        permissions: IPublicRoleData[];
        errors: [Error]
    }

    type setPermissionsResult {
        added: IPublicPermissionData[];
        updated: IPublicPermissionData[];
        errors: [Error]
    }

    type SetRolesResult {
        added: IPublicPermissionData[];
        updated: IPublicPermissionData[];
        errors: [Error]
    }

    type AccessControlQuery {
        getPermissions (blockId: String!) : GetPermissionsResult
        getRoles (blockId: String!): GetRolesResult
    }

    type AccessControlMutation {
        setPermissions (
            blockId: String!,
            permissions: SetPermissionsInput!
        ): SetPermissionsResult

        setRoles (
            blockId: String!,
            roles: SetRolesInput!
        ): SetRolesResult
    }
`;

export default accessControlGraphQLSchema;
