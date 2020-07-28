const commentSchema = `
  type Comment {
    customId: String
    taskId: String
    comment: String
    createdBy: String
    createdAt: String
    updatedAt: String
    updatedBy: String
  }

  input AddCommentInput {
    customId: String
    taskId: String
    comment: String
  }

  type CommentQuery {
    addComment(comment: AddCommentInput!) : ErrorOnlyResponse
  }
`;

export default commentSchema;
