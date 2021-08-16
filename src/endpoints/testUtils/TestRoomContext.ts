import getSingletonFunc from "../../utilities/createSingletonFunc";
import RoomContext from "../contexts/RoomContext";

class TestRoomContext extends RoomContext {}

export const getTestRoomContext = getSingletonFunc(() => new TestRoomContext());
