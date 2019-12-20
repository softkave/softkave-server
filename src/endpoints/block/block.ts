import { Document } from "mongoose";
import { IBlock } from "../../mongo/block";

export interface IBlockParam {
  customId: string;
}

export interface IBlockDocument extends Document, IBlock {}
