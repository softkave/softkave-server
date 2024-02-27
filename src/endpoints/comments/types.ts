import {IComment} from '../../mongo/comment/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicCommentData = ConvertDatesToStrings<IComment>;

export interface INewCommentInput {
  customId: string;
  taskId: string;
  comment: string;
}
