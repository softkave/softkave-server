import makeSingletonFn from "../../../utilities/createSingletonFunc";
import BroadcastHistoryContext from "../../contexts/BroadcastHistoryContext";

class TestBroadcastHistoryContext extends BroadcastHistoryContext {}

export const getTestBroadcastHistoryContext = makeSingletonFn(
    () => new TestBroadcastHistoryContext()
);
