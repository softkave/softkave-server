import ErrorList from "../utils/ErrorList";
import OperationError from "../utils/OperationError";

export default interface IServerResponse {
  errors: ErrorList;
  [key: string]: any;
}
