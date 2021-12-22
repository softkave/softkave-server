const types = `
type GetAverageTimeToCompleteTasksResponse {
  avg: Float
  errors: [Error]
}
`;

const endpoint = `
getAverageTimeToCompleteTasks (boardId: String!): GetAverageTimeToCompleteTasksResponse
`;

export const getAverageTimeToCompleteTasksGraphQLSchema = { types, endpoint };
