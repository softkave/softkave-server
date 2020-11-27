import makeSingletonFunc from "../../utilities/createSingletonFunc";
import { getBaseContext } from "../contexts/BaseContext";
import RequestData from "../RequestData";
import { wrapEndpoint } from "../utils";
import addNote from "./addNote/addNote";
import deleteNote from "./deleteNote/deleteNote";
import getNotes from "./getNotes/getNotes";
import noteExists from "./noteExists/noteExists";
import updateNote from "./updateNote/updateNote";

export default class NotesEndpointsGraphQLController {
    public addNote(data, req) {
        return wrapEndpoint(data, req, () =>
            addNote(getBaseContext(), RequestData.fromExpressRequest(req, data))
        );
    }

    public noteExists(data, req) {
        return wrapEndpoint(data, req, () =>
            noteExists(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public deleteNote(data, req) {
        return wrapEndpoint(data, req, () =>
            deleteNote(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public updateNote(data, req) {
        return wrapEndpoint(data, req, () =>
            updateNote(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }

    public getNotes(data, req) {
        return wrapEndpoint(data, req, () =>
            getNotes(
                getBaseContext(),
                RequestData.fromExpressRequest(req, data)
            )
        );
    }
}

export const getNotesEndpointsGraphQLController = makeSingletonFunc(
    () => new NotesEndpointsGraphQLController()
);
