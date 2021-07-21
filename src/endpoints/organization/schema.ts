const organizationSchema = `
    type Organization {
        customId: String
        createdBy: String
        createdAt: String
        type: String
        name: String
        description: String
        updatedAt: String
        updatedBy: String
        color: String
    }

    type MultipleOrganizationsOpResponse {
        errors: [Error]
        organizations: [Organization]
    }

    input CreateOrganizationInput {
        name: String!
        description: String
        color: String!
    }

    input UpdateOrganizationInput {
        name: String
        description: String
        color: String
    }

    type CreateOrganizationResponse {
        errors: [Error]
        organization: Organization
    }

    type OrganizationExistsResponse {
        errors: [Error]
        exists: Boolean
    }

    type OrganizationQuery {
        organizationExists (name: String!) : OrganizationExistsResponse
        getUserOrganizations: MultipleOrganizationsOpResponse
    }

    type OrganizationMutation {
        createOrganization (
            organization: CreateOrganizationInput!
        ) : CreateOrganizationResponse
        updateOrganization (
            organizationId: String!, 
            data: UpdateOrganizationInput!
        ) : CreateOrganizationResponse
    }
`;

export default organizationSchema;
