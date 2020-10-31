const systemSchema = `
    type SystemQuery {
        sendFeedback (title: String!, message: String): ErrorOnlyResponse
    }
`;

export default systemSchema;
