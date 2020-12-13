const accessControlGraphQLSchema = `
    type Permission {
        customId: String
        resourceType: String
        action: String
        permissionGroups: [String]
        users: [String]
        orgId: String
        permissionOwnerId: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
        available: Boolean
    }

    type PermissionGroup {
        customId: String
        name: String
        lowerCasedName: String
        description: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
        resourceId: String
        resourceType: String
        prevId: String
        nextId: String
    }

    type UserAssignedPermissionGroup {
        userId: String
        orgId: String
        resourceId: String
        resourceType: String
        permissionGroupId: String
        addedAt: String
        addedBy: String
    }

    # setPermissions
    input PermissionInput {
        permissionGroups: [String]
        users: [String]
    }

    input SetPermissionsPermissionInput {
        customId: String
        data: PermissionInput
    }

    type SetPermissionsResultPermissionItem {
        customId: String
        updatedAt: String
        updatedBy: String
    }

    type SetPermissionsResult {
        permissions: [SetPermissionsResultPermissionItem]
        errors: [Error]
    }

    # addPermissionGroups
    input NewPermissionGroupInput {
        name: String!
        description: String
        prevId: String
        nextId: String
        users: [String]
    }

    input AddPermissionGroupsPermissionGroupInput {
        tempId: String! 
        data: NewPermissionGroupInput!
    }

    type AddPermissionGroupsResultPermissionGroup {
        tempId: String
        permissionGroup: PermissionGroup
    }

    type AddPermissionGroupsResult {
        permissionGroups: [AddPermissionGroupsResultPermissionGroup]
        errors: [Error]
    }

    # updatePermissionGroups
    input UpdatePermissionGroupUsersInput {
        add: [String]
        remove: [String]
    }

    input UpdatePermissionGroupInput {
        name: String
        description: String
        prevId: String
        nextId: String
        users: UpdatePermissionGroupUsersInput
    }

    input UpdatePermissionGroupsPermissionGroupInput {
        customId: String!
        data: UpdatePermissionGroupInput!
    }

    type UpdatePermissionGroupsResultPermissionGroup {
        customId: String
        updatedAt: String
        updatedBy: String
    }

    type UpdatePermissionGroupsResult {
        permissionGroups: [UpdatePermissionGroupsResultPermissionGroup]
        errors: [Error]
    }

    # getResourcePermissions
    type GetResourcePermissionsResult {
        permissions: [Permission]
        errors: [Error]
    }

    # getResourcePermissonGroups
    type GetResourcePermissionGroupsResult {
        permissionGroups: [PermissionGroup]
        errors: [Error]
    }

    # permissionGroupExists
    type PermissionGroupExistsResult {
        exists: Boolean
        errors: [Error]
    }

    # getUserPermissions
    type GetUserPermissionsResult {
        permissionGroups: [UserAssignedPermissionGroup]
        errors: [Error]
    }

    type AccessControlQuery {
        getResourcePermissions (
            blockId: String!
        ) : GetResourcePermissionsResult
        getPermissionGroups (
            blockId: String!
        ): GetResourcePermissionGroupsResult
        permissionGroupExists (
            blockId: String!,
            name: String!
        ): PermissionGroupExistsResult
        getUserPermissions: GetUserPermissionsResult
    }

    type AccessControlMutation {
        setPermissions (
            blockId: String!,
            permissions: [SetPermissionsPermissionInput!]!
        ): SetPermissionsResult
        addPermissionGroups (
            blockId: String!,
            permissionGroups: [AddPermissionGroupsPermissionGroupInput!]!
        ): AddPermissionGroupsResult
        updatePermissionGroups (
            blockId: String!,
            permissionGroups: [UpdatePermissionGroupsPermissionGroupInput!]!
        ): UpdatePermissionGroupsResult
    }
`;

export default accessControlGraphQLSchema;
