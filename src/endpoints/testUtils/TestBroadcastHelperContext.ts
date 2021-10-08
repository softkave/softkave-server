import makeSingletonFn from "../../utilities/createSingletonFunc";
import BroadcastHelpers from "../contexts/BroadcastHelpers";

class TestBroadcastHelpers extends BroadcastHelpers {}

export const getTestBroadcastHelpers = makeSingletonFn(
    () => new TestBroadcastHelpers()
);
