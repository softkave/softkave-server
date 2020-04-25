import { Document } from "mongoose";

export interface IStatus {
  customId: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt?: number;
  updatedBy?: string;
  updatedAt?: number;
}

export const statusSchema = {
  customId: { type: String },
  name: { type: String },
  description: { type: String },
  createdBy: { type: String },
  createdAt: { type: Number },
  updatedBy: { type: String },
  updatedAt: { type: Number },
};

export interface IStatusDocument extends Document, IStatus {}
