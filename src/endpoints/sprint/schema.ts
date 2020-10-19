const sprintSchema = `
    type Sprint {
        customId: String
        boardId: String
        orgId: String
        duration: string
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

    type AddSprintResult {
        errors: [Error]
        data: Sprint
    }

    input UpdateSprintInput {
        name: String
        duration: String
    }

    type GetSprintsResult {
        errors: [Error]
        data: [Sprint]
    }

    input UpdateSprintOptionsInput {
        duration: String
    }

    type SprintExistsResult {
        errors: [Error]
        data: Boolean
    }

    type SetupSprintsResult {
        errors: [Error]
        data: SprintOptions
    }

    type SprintQuery {
        addSprint (boardId: String!, name: String): AddSprintResult
        updateSprint (sprintId: String!, data: UpdateSprintInput!): ErrorOnlyResponse
        deleteSprint (sprintId: String!): ErrorOnlyResponse
        startSprint (sprintId: String!): ErrorOnlyResponse
        endSprint (sprintId: String!): ErrorOnlyResponse
        getSprints (boardId: String!): GetSprintsResult
        updateSprintOptions (boardId: String!, data: UpdateSprintOptionsInput): ErrorOnlyResponse
        setupSprints (boardId: String!, duration: String!): SetupSprintsResult
        sprintExists (boardId: String!, name: String!): SprintExistsResult
    }
`;

export default sprintSchema;
