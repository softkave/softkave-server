import { Connection } from "mongoose";
import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getDefaultConnection } from "../defaultConnection";
import MongoModel from "../MongoModel";
import collaborationRequestSchema, {
    ICollaborationRequestDocument,
} from "./definitions";

const modelName = "collaborationRequest";
const collectionName = "collaborationRequests";

export const getCollaborationRequestModel = makeSingletonFunc(
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
