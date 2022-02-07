import { getComplexTypeArrayInputGraphQLSchema } from "../utils";

const boardSchema = `
    type Status {
        customId: String
        name: String
        description: String
        color: String
        position: Float
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
    }

    input StatusInput {
        customId: String
        name: String
        color: String
        description: String
        position: Float
    }

    type Label {
        customId: String
        name: String
        color: String
        description: String
        createdBy: String
        createdAt: String
        updatedBy: String
        updatedAt: String
    }

    input LabelInput {
        customId: String
        name: String
        color: String
        description: String
    }

    type BoardStatusResolution {
        customId: String
        name: String
        createdBy: String
        createdAt: String
        description: String
        updatedBy: String
        updatedAt: String
    }

    input BoardStatusResolutionInput {
        customId: String
        name: String
        description: String
    }

    type BoardSprintOptions {
        duration: String
        updatedAt: String
        updatedBy: String
        createdAt: String
        createdBy: String
    }

    type Board {
        customId: String
        createdBy: String
        createdAt: String
        type: String
        name: String
        description: String
        color: String
        updatedAt: String
        updatedBy: String
        parent: String
        rootBlockId: String
        boardStatuses: [Status]
        boardLabels: [Label]
        boardResolutions: [BoardStatusResolution]
        currentSprintId: String
        sprintOptions: BoardSprintOptions
        lastSprintId: String
    }

    type SingleBoardOpResponse {
        errors: [Error]
        board: Board
    }

    type MultipleBoardsOpResponse {
        errors: [Error]
        boards: [Board]
    }

    input CreateBoardInput {
        name: String!
        description: String
        color: String!
        parent: String!
        boardStatuses: [StatusInput]!
        boardLabels: [LabelInput]!
        boardResolutions: [BoardStatusResolutionInput]!
    }

    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockStatusInput",
        "StatusInput"
    )}

    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockBoardStatusResolutionInput",
        "BoardStatusResolutionInput"
    )}

    ${getComplexTypeArrayInputGraphQLSchema(
        "UpdateBlockLabelInput",
        "LabelInput"
    )}

    input UpdateBoardInput {
        name: String
        description: String
        color: String
        boardStatuses: UpdateBlockStatusInput
        boardLabels: UpdateBlockLabelInput
        boardResolutions: UpdateBlockBoardStatusResolutionInput
    }

    type CreateBoardResponse {
        errors: [Error]
        board: Board
    }

    type BoardExistsResponse {
        errors: [Error]
        exists: Boolean
    }

    type BoardQuery {
        boardExists (name: String!, parent: String!) : BoardExistsResponse
        getOrganizationBoards (organizationId: String!) : MultipleBoardsOpResponse
    }

    type BoardMutation {
        createBoard (board: CreateBoardInput!) : CreateBoardResponse
        updateBoard (
            boardId: String!,
            data: UpdateBoardInput!) : CreateBoardResponse
        deleteBoard (boardId: String!) : ErrorOnlyResponse
    }
`;

export default boardSchema;
