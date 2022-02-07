import { Connection } from "mongoose";
import makeSingletonFn from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import collaborationRequestSchema, {
    ICollaborationRequestDocument,
} from "./definitions";

const modelName = "collaboration-request";
const collectionName = "collaboration-requests";

export const getCollaborationRequestModel = makeSingletonFn(
    (conn: Connection = getDefaultConnection().getConnection()) => {
        return new MongoModel<ICollaborationRequestDocument>({
            modelName,
            collectionName,
            rawSchema: collaborationRequestSchema,
            connection: conn,
        });
    }
);

export interface ICollaborationRequestModel
    extends MongoModel<ICollaborationRequestDocument> {}
