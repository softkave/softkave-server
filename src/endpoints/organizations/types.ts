import {ResourceVisibility} from '../../models/resource';
import {IWorkspace} from '../../mongo/block/workspace';
import {ConvertDatesToStrings} from '../../utilities/types';

export interface INewOrganizationInput {
  name: string;
  description?: string;
  color: string;
  visibility?: ResourceVisibility;
}

export type IPublicOrganization = ConvertDatesToStrings<IWorkspace>;
