import getSingletonFunc from "../../utilities/createSingletonFunc";
import BroadcastHelpers from "../contexts/BroadcastHelpers";

class TestBroadcastHelpers extends BroadcastHelpers {}

export const getTestBroadcastHelpers = getSingletonFunc(
    () => new TestBroadcastHelpers()
);
