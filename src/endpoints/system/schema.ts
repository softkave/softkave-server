const systemSchema = `
    type SystemMutation {
        sendFeedback (
            feedback: String!,
            description: String,
            notifyEmail: String
        ): ErrorOnlyResponse
    }
`;

export default systemSchema;
