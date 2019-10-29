import jwtConstants from "../../utils/jwtConstants";
import { IUser } from "./user";

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

export interface IBaseTokenData {
  customId: string;
  email: string;
  changePasswordHistory: number[];
  domain: string;
  iat: number;
}

function newToken(user: IUser, additionalInfo?: any) {
  return jwt.sign(
    {
      customId: user.customId,
      email: user.email,
      changePasswordHistory: user.changePasswordHistory,
      domain: jwtConstants.domains.login,
      ...additionalInfo
    },
    JWT_SECRET
  );
}

export default newToken;
