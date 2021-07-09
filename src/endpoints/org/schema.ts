const orgSchema = `
    type Org {
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

    type MultipleOrgsOpResponse {
        errors: [Error]
        orgs: [Org]
    }

    input CreateOrgInput {
        name: String!
        description: String
        color: String!
    }

    input UpdateOrgInput {
        name: String
        description: String
        color: String
    }

    type CreateOrgResponse {
        errors: [Error]
        org: Org
    }

    type OrgExistsResponse {
        errors: [Error]
        exists: Boolean
    }

    type OrgQuery {
        orgExists (name: String!) : OrgExistsResponse
        getUserOrgs: MultipleOrgsOpResponse
    }

    type OrgMutation {
        createOrg (org: CreateOrgInput!) : CreateOrgResponse
        updateOrg (orgId: String!, data: UpdateOrgInput!) : CreateOrgResponse
    }
`;

export default orgSchema;
