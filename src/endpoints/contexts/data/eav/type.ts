import {IEav, IEavAssignedPermissionGroup} from '../../../../mongo/eav/eav';
import {DataQuery, IBaseDataProvider} from '../types';

export type IEavQuery = DataQuery<IEav>;
export type IEavAssignedPermissionGroupQuery = DataQuery<IEavAssignedPermissionGroup>;
export type IEavDataProvider = IBaseDataProvider<IEav>;
