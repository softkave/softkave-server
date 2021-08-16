import { IAuditLog } from "../../mongo/audit-log";
import getSingletonFunc from "../../utilities/createSingletonFunc";
import {
    getLogFromEntry,
    IAuditLogContext,
    IAuditLogInsertEntry,
} from "../contexts/AuditLogContext";
import { IBaseContext } from "../contexts/BaseContext";
import BroadcastHistoryContext from "../contexts/BroadcastHistoryContext";

class TestBroadcastHistoryContext extends BroadcastHistoryContext {}

export const getTestBroadcastHistoryContext = getSingletonFunc(
    () => new TestBroadcastHistoryContext()
);
