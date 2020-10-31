import BlockController, { getBlockController } from "./block/controller";
import CommentController, { getCommentController } from "./comment/controller";
import NoteController, { getNoteController } from "./note/controller";
import SprintController, { getSprintController } from "./sprint/controller";
import SystemController, { getSystemController } from "./system/controller";
import UserController, { getUserController } from "./user/controller";

export default class EndpointController {
    public block: BlockController = getBlockController();
    public user: UserController = getUserController();
    public note: NoteController = getNoteController();
    public comment: CommentController = getCommentController();
    public sprint: SprintController = getSprintController();
    public system: SystemController = getSystemController();
}

const controller: EndpointController = new EndpointController();

export function getEndpointController() {
    return controller;
}
