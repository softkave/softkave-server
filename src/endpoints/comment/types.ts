export interface IPublicCommentData {
  customId: string;
  taskId: string;
  comment: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface INewCommentInput {
  customId: string;
  taskId: string;
  comment: string;
}
