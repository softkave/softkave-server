import BaseContext, { IBaseContext } from "../../contexts/BaseContext";
import RequestData from "../../contexts/RequestData";
import noteExists from "../noteExists/noteExists";
import { INoteExistsParameters } from "../noteExists/types";
import { IAddNoteContext } from "./types";

export default class AddNoteContext extends BaseContext
  implements IAddNoteContext {
  public async noteExists(
    context: IBaseContext,
    instData: RequestData<INoteExistsParameters>
  ) {
    return noteExists(context, instData);
  }
}
