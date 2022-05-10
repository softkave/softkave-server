const sprintSchema = `
    type Sprint {
        customId: String
        boardId: String
        orgId: String
        duration: String
        prevSprintId: String
        nextSprintId: String
        sprintIndex: Int
        name: String
        startDate: String
        startedBy: String
        endDate: String
        endedBy: String
        updatedAt: String
        updatedBy: String
        createdAt: String
        createdBy: String
    }

    type SprintOptions {
        duration: String
        updatedAt: String
        updatedBy: String
        createdAt: String
        createdBy: String
    }

    input NewSprintInput {
        name: String
        duration: String
    }

    type AddSprintResult {
        errors: [Error]
        sprint: Sprint
    }

    input UpdateSprintInput {
        name: String
        duration: String
        startDate: String
        endDate: String
    }

    type UpdateSprintResult {
        errors: [Error]
        sprint: Sprint
    }

    type GetSprintsResult {
        errors: [Error]
        sprints: [Sprint]
    }

    input UpdateSprintOptionsInput {
        duration: String
    }

    type UpdateSprintOptionsResult {
        errors: [Error]
        sprintOptions: SprintOptions
    }

    type SprintExistsResult {
        errors: [Error]
        exists: Boolean
    }

    type SprintQuery {
        getSprints (boardId: String!): GetSprintsResult
        sprintExists (boardId: String!, name: String!): SprintExistsResult
    }

    type SprintMutation {
        addSprint (boardId: String!, data: NewSprintInput!): AddSprintResult
        updateSprint (sprintId: String!, data: UpdateSprintInput!): UpdateSprintResult
        deleteSprint (sprintId: String!): ErrorOnlyResponse
    }
`;

export default sprintSchema;
