import { Document } from "mongoose";

export interface ILabel {
  customId: string;
  name: string;
  color: string;
  description?: string;
  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
}

export const labelSchema = {
  customId: { type: String },
  name: { type: String },
  color: { type: String },
  description: { type: String },
  createdBy: { type: String },
  createdAt: { type: Number },
  updatedBy: { type: String },
  updatedAt: { type: Number },
};

export interface ILabelDocument extends Document, ILabel {}
