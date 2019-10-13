import { Document } from "mongoose";

export interface ITaskCollaborator {
  userId: string;
  completedAt: number;
  assignedAt: number;
  assignedBy: string;
}

export interface IBlockRole {
  roleName: string;
  createdBy: string;
  createdAt: number;
}

export interface IBlock {
  customId: string;
  name: string;
  description: string;
  expectedEndAt: number;
  createdAt: number;
  color: string;
  updatedAt: number;
  type: string;
  parents: string[];
  createdBy: string;
  taskCollaborators: ITaskCollaborator[];
  priority: string;
  isBacklog: boolean;
  tasks: string[];
  groups: string[];
  projects: string[];
  groupTaskContext: string[];
  groupProjectContext: string[];
  roles: IBlockRole[];
}

export interface IBlockDocument extends Document, IBlock {}
