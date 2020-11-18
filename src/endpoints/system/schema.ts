const systemSchema = `
    type SystemQuery {
        sendFeedback (
            feedback: String!,
            description: String,
            notifyEmail: String
        ): ErrorOnlyResponse
    }
`;

export default systemSchema;
