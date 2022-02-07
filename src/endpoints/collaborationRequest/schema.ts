const requestsSchema = `
    type CollaborationRequestFrom {
        userId: String
        name: String
        blockId: String
        blockName: String
        blockType: String
    }

    type CollaborationRequestTo {
        email: String
    }

    type CollaborationRequestStatusHistory {
        status: String
        date: String
    }

    type CollaborationRequestSentEmailHistory {
        date: String
    }

    type CollaborationRequest {
        customId: String
        from: CollaborationRequestFrom
        createdAt: String
        readAt: String
        to: CollaborationRequestTo
        statusHistory: [CollaborationRequestStatusHistory]
        sentEmailHistory: [CollaborationRequestSentEmailHistory]
        type: String
    }

    type GetCollaborationRequestsResponse {
        errors: [Error]
        requests: [CollaborationRequest]
    }

    input NewCollaboratorInput {
        email: String!
    }

    type AddCollaboratorsResult {
        errors: [Error]
        requests: [CollaborationRequest]
    }

    type SingleRequestOpResult {
        errors: [Error]
        request: CollaborationRequest
    }

    type RespondToCollaborationRequestResponse {
        errors: [Error]
        organization: Organization
        respondedAt: String
    }

    type CollaborationRequestsQuery {
        getOrganizationRequests(organizationId: String!) : GetCollaborationRequestsResponse
        getUserRequests : GetCollaborationRequestsResponse
    }

    type CollaborationRequestsMutation {
        addCollaborators (
            organizationId: String!,
            collaborators: [NewCollaboratorInput!]!
        ) : AddCollaboratorsResult
        revokeRequest (organizationId: String!, requestId: String!) : SingleRequestOpResult
        respondToRequest (
            requestId: String!, 
            response: String!
        ): RespondToCollaborationRequestResponse
        markRequestRead (requestId: String!): ErrorOnlyResponse
    }
`;

export default requestsSchema;
