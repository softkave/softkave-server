import { SchemaTypes, Document } from "mongoose";
import { getDate } from "../../utilities/fns";
import { BlockType } from "../block";
import { IParentInformation, parentSchema } from "../definitions";

export enum CustomPropertyType {
    Text = "text",
    Date = "date",
    Selection = "selection",
    Number = "number",
}

export enum TextResourceTypes {
    Text = "text",
}

export interface TextCustomTypeMeta {
    minChars?: number;
    maxChars?: number;
    type: TextResourceTypes;
}

export interface DateCustomTypeMeta {
    isRange?: boolean;
    startDate?: string;
    endDate?: string;
}

export enum SelectionResourceTypes {
    Collaborator = "collaborator",
    Board = "board",
    Task = "task",
    Room = "room",
    CollaborationRequest = "collaborationRequest",
    Custom = "custom",
}

export interface ISelectionFrom {
    customId: string;
    type: BlockType.Organization | BlockType.Board;
}

export interface ICustomSelectionOption {
    customId: string;
    name: string;
    description?: string;
    parents: IParentInformation[];
    propertyId: string;
    color?: string;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    prevOptionId?: string;
    nextOptionId?: string;
}

export interface SelectionCustomTypeMeta {
    type: SelectionResourceTypes;
    isMultiple?: boolean;
    min?: number;
    max?: number;
    selectFrom: ISelectionFrom | null;
}

export enum NumberTypes {
    Interger = "int",
    Decimal = "decimal",
}

export interface INumberTypeFormatting {
    decimalPlaces?: number;
}

export interface NumberCustomTypeMeta {
    type: NumberTypes;
    min: number;
    max: number;
    format: INumberTypeFormatting;
}

export interface ICustomProperty {
    customId: string;
    name: string;
    description?: string;
    parents: IParentInformation[];
    type: CustomPropertyType;
    isRequired?: boolean;
    meta: any;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

export interface TextCustomTypeValue {
    value?: string;
}

export interface DateCustomTypeValue {
    date?: Date;
    endDate?: Date;
}

export interface SelectionCustomTypeValue {
    value: string[];
}

export interface NumberCustomTypeValue {
    value: number;
}

export interface ICustomPropertyValue {
    customId: string;
    propertyId: string;
    parents: IParentInformation[];
    type: CustomPropertyType;
    value: any;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

export const customSelectionOptionSchema = {
    customId: { type: String, unique: true, index: true },
    name: { type: String },
    description: { type: String },
    parents: { type: [parentSchema], default: [] },
    propertyId: { type: String },
    color: { type: String },
    createdBy: { type: String },
    createdAt: { type: Date, default: getDate },
    updatedAt: { type: Date },
    updatedBy: { type: String },
    prevOptionId: { type: String },
    nextOptionId: { type: String },
};

export const customPropertySchema = {
    customId: { type: String, unique: true, index: true },
    createdBy: { type: String },
    createdAt: { type: Date, default: getDate },
    name: { type: String },
    description: { type: String },
    parents: { type: [parentSchema], default: [] },
    type: { type: String },
    isRequired: { type: Boolean },
    meta: { type: SchemaTypes.Mixed },
    updatedAt: { type: Date },
    updatedBy: { type: String },
};

export const customPropertyValueSchema = {
    customId: { type: String, unique: true, index: true },
    propertyId: { type: String },
    parents: { type: [parentSchema], default: [] },
    type: { type: String },
    value: { type: SchemaTypes.Mixed },
    createdBy: { type: String },
    createdAt: { type: Date },
    updatedBy: { type: String },
    updatedAt: { type: Date },
};

export interface ICustomPropertyDocument extends Document, ICustomProperty {}

export interface ICustomPropertyValueDocument
    extends Document,
        ICustomPropertyValue {}

export type ICustomSelectionOptionDocument = ICustomSelectionOption & Document;
