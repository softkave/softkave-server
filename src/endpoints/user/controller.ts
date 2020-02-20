import { IEndpointControllerProps } from "endpoints/controller";
import SignupContext from "./signup/context";
import signup from "./signup/signup";

export default class UserController {
  protected props: IEndpointControllerProps;

  constructor(props: IEndpointControllerProps) {
    this.props = props;
  }

  public signup(data, req) {
    return signup(
      new SignupContext({
        req,
        data,
        ...this.props
      })
    );
  }
}
