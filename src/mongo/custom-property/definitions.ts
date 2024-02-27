import {Connection, SchemaTypes} from 'mongoose';
import {SystemResourceType} from '../../models/system';
import makeSingletonFn from '../../utilities/createSingletonFunc';
import {getDate} from '../../utilities/fns';
import MongoModel from '../MongoModel';
import {getDefaultMongoConnection} from '../defaultConnection';
import {IParentInformation, parentSchema} from '../definitions';

export const customPropertySchemaV1 = 1;
export const customPropertyValueSchemaV1 = 1;
export const customSelectionOptionSchemaV1 = 1;

export enum CustomPropertyType {
  Text = 'text',
  Date = 'date',
  Selection = 'selection',
  Number = 'number',
}

export enum TextResourceTypes {
  Text = 'text',
}

export interface ITextCustomTypeMeta {
  minChars?: number;
  maxChars?: number;
  defaultText?: string;
  type: TextResourceTypes;
}

export interface IDateCustomTypeMeta {
  isRange?: boolean;
  startDate?: string;
  endDate?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export enum SelectionResourceTypes {
  Collaborator = 'collaborator',
  Board = 'board',
  Task = 'task',
  Room = 'room',
  CollaborationRequest = 'collaboration-request',
  CustomOptions = 'custom-options',
}

export interface ISelectOptionsFrom {
  customId: string;
  type: SystemResourceType.Workspace | SystemResourceType.Board;
}

export interface ICustomSelectionOption {
  customId: string;
  name: string;
  description?: string;
  organizationId: string;
  parent: IParentInformation;
  propertyId: string;
  color?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;

  // TODO: validate if options exist
  prevOptionId?: string;
  nextOptionId?: string;
}

export interface ISelectionCustomTypeMeta {
  type: SelectionResourceTypes;
  isMultiple?: boolean;
  min?: number;
  max?: number;

  // TODO: update selectFrom on block delete
  selectFrom: ISelectOptionsFrom | null;

  // Custom options properties
  areCustomOptionsUnique?: boolean;
  shouldCustomOptionsBeLinked?: boolean;
  // End custom options properties

  // TODO: validate if default options exists
  // TODO: remove option ID when default option is deleted
  defaultOptions?: string[];
}

export enum NumberTypes {
  Interger = 'int',
  Decimal = 'decimal',
}

export interface INumberCustomTypeMeta {
  type: NumberTypes;
  min: number;
  max: number;
  decimalPlaces?: number;
  defaultNumber?: number;
}

export interface ICustomProperty {
  customId: string;
  name: string;
  description?: string;
  organizationId: string;
  parent: IParentInformation;
  type: CustomPropertyType;
  isRequired?: boolean;
  meta:
    | ITextCustomTypeMeta
    | ISelectionCustomTypeMeta
    | IDateCustomTypeMeta
    | INumberCustomTypeMeta;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface ITextCustomTypeValue {
  value?: string;
}

export interface IDateCustomTypeValue {
  date?: Date;
  endDate?: Date;
}

export interface ISelectionCustomTypeValue {
  value: string[];
}

export interface INumberCustomTypeValue {
  value: number;
}

export interface ICustomPropertyValue {
  customId: string;
  propertyId: string;
  organizationId: string;
  parent: IParentInformation;
  type: CustomPropertyType;
  value:
    | ITextCustomTypeValue
    | IDateCustomTypeValue
    // | ISelectionCustomTypeValue
    | INumberCustomTypeValue
    | null;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export const customSelectionOptionSchema = {
  customId: {type: String, unique: true, index: true},
  name: {type: String},
  description: {type: String},
  parent: {type: parentSchema},
  organizationId: {type: String},
  propertyId: {type: String},
  color: {type: String},
  createdBy: {type: String},
  createdAt: {type: Date, default: getDate},
  updatedAt: {type: Date},
  updatedBy: {type: String},
  prevOptionId: {type: String},
  nextOptionId: {type: String},
};

export const customPropertySchema = {
  customId: {type: String, unique: true, index: true},
  createdBy: {type: String},
  createdAt: {type: Date, default: getDate},
  name: {type: String},
  description: {type: String},
  organizationId: {type: String},
  parent: {type: parentSchema},
  type: {type: String},
  isRequired: {type: Boolean},
  meta: {type: SchemaTypes.Mixed},
  updatedAt: {type: Date},
  updatedBy: {type: String},
};

export const customPropertyValueSchema = {
  customId: {type: String, unique: true, index: true},
  propertyId: {type: String},
  organizationId: {type: String},
  parent: {type: parentSchema},
  type: {type: String},
  value: {type: SchemaTypes.Mixed},
  createdBy: {type: String},
  createdAt: {type: Date},
  updatedBy: {type: String},
  updatedAt: {type: Date},
};

export enum CustomValueAttrs {
  SelectionValue = 'selection-value',
}

const customSelectionOptionModelName = 'custom_selection_option_01';
const customSelectionOptionCollectionName = 'custom_selection_options_01';

export const getCustomSelectionOptionModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<ICustomSelectionOption>({
      modelName: customSelectionOptionModelName,
      collectionName: customSelectionOptionCollectionName,
      rawSchema: customSelectionOptionSchema,
      connection: conn,
    });
  }
);

export type ICustomSelectionOptionModel = MongoModel<ICustomSelectionOption>;

const customPropertyModelName = 'custom-property';
const customPropertyCollectionName = 'custom-properties';

export const getCustomPropertyModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<ICustomProperty>({
      modelName: customPropertyModelName,
      collectionName: customPropertyCollectionName,
      rawSchema: customPropertySchema,
      connection: conn,
    });
  }
);

export type ICustomPropertyModel = MongoModel<ICustomProperty>;

const customPropertyValueModelName = 'custom-property-value';
const customPropertyValueCollectionName = 'custom-property-values';

export const getCustomPropertyValueModel = makeSingletonFn(
  (conn: Connection = getDefaultMongoConnection().getConnection()) => {
    return new MongoModel<ICustomPropertyValue>({
      modelName: customPropertyValueModelName,
      collectionName: customPropertyValueCollectionName,
      rawSchema: customPropertyValueSchema,
      connection: conn,
    });
  }
);

export type ICustomPropertyValueModel = MongoModel<ICustomPropertyValue>;
