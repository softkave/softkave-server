import {IUser} from '../../mongo/user/definitions';
import {extractFields, getFields, publicResourceFields} from '../utils';
import {ICollaborator} from './types';

const collaboratorFields = getFields<ICollaborator>({
  ...publicResourceFields,
  firstName: true,
  lastName: true,
  email: true,
  color: true,
});

export function getCollaboratorDataFromUser(user: IUser): ICollaborator {
  return extractFields(user, collaboratorFields);
}

export function getCollaboratorsArray(users: Array<ICollaborator | IUser>): ICollaborator[] {
  return users.map(user => extractFields(user, collaboratorFields));
}
