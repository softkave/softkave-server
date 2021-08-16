import getSingletonFunc from "../../utilities/createSingletonFunc";
import SessionContext from "../contexts/SessionContext";

class TestSessionContext extends SessionContext {}

export const getTestSessionContext = getSingletonFunc(
    () => new TestSessionContext()
);
