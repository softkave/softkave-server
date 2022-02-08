import { BlockType } from "../../mongo/block";
import {
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../mongo/collaboration-request";

export function getBlockRootBlockId(block: {
    rootBlockId?: string;
    customId: string;
}) {
    return block.rootBlockId || block.customId;
}

export function getBlockTypeName(blockType: BlockType) {
    switch (blockType) {
        case "org":
            return "Organization";

        case "task":
            return "Task";

        case "board":
            return "Board";

        case "root":
        default:
            return "Block";
    }
}

export function isRequestAccepted(request: ICollaborationRequest) {
    if (Array.isArray(request.statusHistory)) {
        return !!request.statusHistory.find((status) => {
            return status.status === CollaborationRequestStatusType.Accepted;
        });
    }

    return false;
}
