import { Document, SchemaTypes } from "mongoose";

export interface IToken {
    customId: string;
    userId?: string;
    version: number;
    issuedAt: string; // not same as iat in token
    audience: string[];
    expires?: number;
    isActive: boolean;
    meta?: Record<string, string | number | boolean | null>;
}

const tokenMongoSchema = {
    customId: { type: String, unique: true },
    userId: { type: String },
    version: { type: Number },
    issuedAt: { type: Number },
    audience: { type: [String] },
    expires: { type: Number },
    isActive: { type: Number },
    meta: { type: SchemaTypes.Mixed },
};

export default tokenMongoSchema;

export interface ITokenDocument extends IToken, Document {}
