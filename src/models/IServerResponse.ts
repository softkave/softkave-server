import ErrorList from "../utilities/ErrorList";
import OperationError from "../utilities/OperationError";

export default interface IServerResponse {
  errors: ErrorList;
  [key: string]: any;
}
