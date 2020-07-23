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

  input AddComment {
    customId: String
    taskId: String
    comment: String
  }

  type CommentQuery {
    addComment(comment: AddComment!) : ErrorOnlyResponse
  }
`;

export default commentSchema;
