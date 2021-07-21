import { Document, SchemaTypes } from "mongoose";

export interface IToken {
    customId: string;
    userId: string;
    version: number;

    // not same as iat in encoded token, may be a litte bit behind or after
    // and is a ISO string, where iat in encoded token is in seconds
    issuedAt: string;
    audience: string[];

    // not same as expires in encoded token. expires here is in milliseconds,
    // where expires in encoded token is in seconds
    expires?: number;
    meta?: Record<string, string | number | boolean | null>;
    clientId?: string;
}

const tokenMongoSchema = {
    customId: { type: String, unique: true },
    userId: { type: String },
    version: { type: Number },
    issuedAt: { type: Date },
    audience: { type: [String] },
    expires: { type: Number },
    meta: { type: SchemaTypes.Mixed },
    clientId: { type: String },
};

export default tokenMongoSchema;

export interface ITokenDocument extends IToken, Document {}
