import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import { wrapEndpointREST } from "../utils";
import changePasswordWithCurrentPassword from "./changePasswordWithCurrentPassword/handler";
import changePasswordWithToken from "./changePasswordWithToken/changePasswordWithToken";
import forgotPassword from "./forgotPassword/forgotPassword";
import getUserData from "./getUserData/getUserData";
import login from "./login/login";
import signup from "./signup/signup";
import updateUser from "./updateUser/updateUser";
import userExists from "./userExists/userExists";

const baseURL = "/api/user";
export default function setupUserRESTEndpoints(
  ctx: IBaseContext,
  app: Express
) {
  const endpoints = {
    changePasswordWithCurrentPassword: wrapEndpointREST(
      changePasswordWithCurrentPassword,
      ctx
    ),
    changePasswordWithToken: wrapEndpointREST(changePasswordWithToken, ctx),
    forgotPassword: wrapEndpointREST(forgotPassword, ctx),
    getUserData: wrapEndpointREST(getUserData, ctx),
    login: wrapEndpointREST(login, ctx),
    signup: wrapEndpointREST(signup, ctx),
    updateUser: wrapEndpointREST(updateUser, ctx),
    userExists: wrapEndpointREST(userExists, ctx),
  };

  app.post(
    `${baseURL}/changePasswordWithCurrentPassword`,
    endpoints.changePasswordWithCurrentPassword
  );
  app.post(
    `${baseURL}/changePasswordWithToken`,
    endpoints.changePasswordWithToken
  );
  app.post(`${baseURL}/forgotPassword`, endpoints.forgotPassword);
  app.post(`${baseURL}/getUserData`, endpoints.getUserData);
  app.post(`${baseURL}/login`, endpoints.login);
  app.post(`${baseURL}/signup`, endpoints.signup);
  app.post(`${baseURL}/updateUser`, endpoints.updateUser);
  app.post(`${baseURL}/userExists`, endpoints.userExists);
}
