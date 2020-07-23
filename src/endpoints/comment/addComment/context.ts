import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import { IEndpointInstanceData } from "../../contexts/types";
import { IAddCommentContext, IAddCommentParameters } from "./types";

export default class AddCommentContext extends BaseContext
  implements IAddCommentContext {
  public async addComment(
    context: IBaseContext,
    instData: IEndpointInstanceData<IAddCommentParameters>
  ) {}
}
