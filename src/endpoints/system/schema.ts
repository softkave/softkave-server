const systemSchema = `
    type SystemQuery {
        
    }

    type SystemMutation {
        sendFeedback (
            feedback: String!,
            description: String,
            notifyEmail: String
        ): ErrorOnlyResponse
    }
`;

export default systemSchema;
