import {IResource} from '../../models/resource';
import {BlockType} from '../../mongo/block/definitions';
import {IUser} from '../../mongo/user/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type IPublicUserData = ConvertDatesToStrings<
  IResource &
    Pick<
      IUser,
      | 'color'
      | 'email'
      | 'isAnonymousUser'
      | 'firstName'
      | 'lastName'
      | 'notificationsLastCheckedAt'
      | 'workspaces'
    >
>;

export interface IUserRootBlock {
  customId: string;
  createdBy: string;
  createdAt: Date;
  type: BlockType.Root;
  name: string;
  color: string;
}
