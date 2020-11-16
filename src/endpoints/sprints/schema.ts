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

    input SprintOptionsInput {
        duration: String
    }

    type SetupSprintsResult {
        errors: [Error]
        sprintOptions: SprintOptions
    }

    type StartSprintResult {
        errors: [Error]
        startDate: String
    }

    type EndSprintResult {
        errors: [Error]
        endDate: String
    }

    type SprintQuery {
        addSprint (boardId: String!, data: NewSprintInput!): AddSprintResult
        updateSprint (sprintId: String!, data: UpdateSprintInput!): UpdateSprintResult
        deleteSprint (sprintId: String!): ErrorOnlyResponse
        startSprint (sprintId: String!): StartSprintResult
        endSprint (sprintId: String!): EndSprintResult
        getSprints (boardId: String!): GetSprintsResult
        updateSprintOptions (boardId: String!, data: UpdateSprintOptionsInput): UpdateSprintOptionsResult
        setupSprints (boardId: String!, data: SprintOptionsInput!): SetupSprintsResult
        sprintExists (boardId: String!, name: String!): SprintExistsResult
    }
`;

export default sprintSchema;
