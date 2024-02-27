import {IComment} from '../../mongo/comment/definitions';
import {extractFields, getFields, publicWorkspaceResourceFields} from '../utils';
import {IPublicCommentData} from './types';

const publicCommentFields = getFields<IPublicCommentData>({
  ...publicWorkspaceResourceFields,
  taskId: true,
  comment: true,
});

export function getPublicCommentData(comment: IComment): IPublicCommentData {
  return extractFields(comment, publicCommentFields);
}

export function getPublicCommentsArray(comments: IComment[]): IPublicCommentData[] {
  return comments.map(comment => extractFields(comment, publicCommentFields));
}
