import { SystemResourceType } from "../../models/system";
import { BlockType, IBlock } from "../block";

export function getBlockAuditLogResourceType(
    block: IBlock
): SystemResourceType {
    switch (block.type) {
        case BlockType.Board:
            return SystemResourceType.Board;

        case BlockType.Org:
            return SystemResourceType.Org;

        case BlockType.Root:
            return SystemResourceType.RootBlock;

        case BlockType.Task:
            return SystemResourceType.Task;
    }
}
