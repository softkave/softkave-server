import BlockController, { getBlockController } from "./block/controller";
import UserController, { getUserController } from "./user/controller";

export default class EndpointController {
  public block: BlockController = getBlockController();
  public user: UserController = getUserController();
}

const controller: EndpointController = new EndpointController();

export function getEndpointController() {
  return controller;
}
