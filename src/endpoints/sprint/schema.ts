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
        data: Sprint
    }

    input UpdateSprintInput {
        name: String
        duration: String
    }

    type UpdateSprintResultData {
        updatedAt: String
    }

    type UpdateSprintResult {
        errors: [Error]
        data: UpdateSprintResultData
    }

    type GetSprintsResult {
        errors: [Error]
        data: [Sprint]
    }

    input UpdateSprintOptionsInput {
        duration: String
    }

    type UpdateSprintOptionsResultData {
        updatedAt: String
    }

    type UpdateSprintOptionsResult {
        errors: [Error]
        data: UpdateSprintOptionsResultData
    }

    type SprintExistsResult {
        errors: [Error]
        data: Boolean
    }

    input SprintOptionsInput {
        duration: String
    }

    type SetupSprintsResult {
        errors: [Error]
        data: SprintOptions
    }

    type StartSprintResultData {
        startDate: String
    }

    type StartSprintResult {
        errors: [Error]
        data: StartSprintResultData
    }

    type EndSprintResultData {
        endDate: String
    }

    type EndSprintResult {
        errors: [Error]
        data: EndSprintResultData
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
