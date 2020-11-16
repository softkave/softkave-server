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

    type AddCommentResult {
        errors: [Error]
        comment: Comment
    }

    type GetCommentsResult {
        comments: [Comment]
    }

    type CommentQuery {
        getComments: GetCommentsResult
        addComment(comment: AddCommentInput!) : AddCommentResult
    }
`;

export default commentSchema;
