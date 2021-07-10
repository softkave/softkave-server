import { getComplexTypeArrayInputGraphQLSchema } from "../utils";

const collaboratorSchema = `
    type Collaborator {
        customId: String
        name: String
        email: String
        color: String
    }

    type GetOrgCollaboratorsResponse {
        errors: [Error]
        collaborators: [Collaborator]
    }

    type CollaboratorQuery {
        getOrgCollaborators (orgId: String!) : GetOrgCollaboratorsResponse
    }

    type CollaboratorMutation {
        removeCollaborator (orgId: String!, collaboratorId: String!) : ErrorOnlyResponse
    }
`;

export default collaboratorSchema;
