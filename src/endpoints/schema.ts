const endpointSchema = `
    type Query {
        user: UserQuery
        sprint: SprintQuery
        system: SystemQuery
        collaborationRequest: CollaborationRequestQuery
        collaborator: CollaboratorQuery
        organization: OrganizationQuery
        board: BoardQuery
        task: TaskQuery
        # customProperty: CustomPropertiesQuery
    }

    type Mutation {
        user: UserMutation
        sprint: SprintMutation
        system: SystemMutation
        collaborationRequest: CollaborationRequestMutation
        client: ClientMutation
        collaborator: CollaboratorMutation
        organization: OrganizationMutation
        board: BoardMutation
        task: TaskMutation
        # customProperty: CustomPropertiesMutation
    }
`;

export default endpointSchema;
