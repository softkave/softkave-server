import {IResource} from '../../models/resource';
import {IUser} from '../../mongo/user/definitions';
import {ConvertDatesToStrings} from '../../utilities/types';

export type ICollaborator = ConvertDatesToStrings<
  IResource & Pick<IUser, 'email' | 'firstName' | 'lastName' | 'color'>
>;
