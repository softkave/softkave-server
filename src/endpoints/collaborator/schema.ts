const collaboratorsSchema = `
    type Collaborator {
        customId: String
        name: String
        email: String
        color: String
    }

    type GetOrganizationCollaboratorsResponse {
        errors: [Error]
        collaborators: [Collaborator]
    }

    type CollaboratorQuery {
        getOrganizationCollaborators (organizationId: String!) : GetOrganizationCollaboratorsResponse
    }

    type CollaboratorMutation {
        removeCollaborator (organizationId: String!, collaboratorId: String!) : ErrorOnlyResponse
    }
`;

export default collaboratorsSchema;
