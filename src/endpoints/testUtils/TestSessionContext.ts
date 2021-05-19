import makeSingletonFunc from "../../utilities/createSingletonFunc";
import SessionContext from "../contexts/SessionContext";

class TestSessionContext extends SessionContext {}

export const getTestSessionContext = makeSingletonFunc(
    () => new TestSessionContext()
);
