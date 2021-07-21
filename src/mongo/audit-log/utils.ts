import { SystemResourceType } from "../../models/system";
import { BlockType, IBlock } from "../block";

export function getBlockAuditLogResourceType(
    block: IBlock
): SystemResourceType {
    switch (block.type) {
        case BlockType.Board:
            return SystemResourceType.Board;

        case BlockType.Organization:
            return SystemResourceType.Organization;

        case BlockType.Root:
            return SystemResourceType.RootBlock;

        case BlockType.Task:
            return SystemResourceType.Task;
    }
}
