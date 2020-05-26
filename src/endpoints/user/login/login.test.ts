import argon2 from "argon2";
import { IUser } from "../../../mongo/user";
import { userEndpoints } from "../constants";
import { InvalidEmailOrPasswordError } from "../errors";
import UserToken from "../UserToken";
import { getPublicUserData } from "../utils";
import login from "./login";
import { ILoginContext } from "./types";

const userEmail = "ywordk@gmail.com";
const correctPassword = "01234567";
const incorrectPassword = "abcdefgh";

const getContext = ({ useIncorrectPassword = false } = {}) => {
  const context: ILoginContext = ({
    data: {
      email: userEmail,
      password: useIncorrectPassword ? incorrectPassword : correctPassword,
    },
    async getUserByEmail(email) {
      const user = ({
        email: userEmail,
        hash: await argon2.hash(correctPassword),
        customId: "",
        name: "Abayomi Akintomide",
        createdAt: 0,
        forgotPasswordHistory: [],
        changePasswordHistory: [],
        lastNotificationCheckTime: 0,
        rootBlockId: "",
        orgs: [""],
        color: "",
      } as unknown) as IUser;

      return user;
    },
  } as unknown) as ILoginContext;

  return context;
};

beforeAll(() => {
  process.env.JWT_SECRET = "fake-secret";
});

test("prevents login if password is incorrect", async () => {
  const context = getContext({ useIncorrectPassword: true });
  await expect(login(context)).rejects.toThrowError(
    InvalidEmailOrPasswordError
  );
});

test("allow login if password is correct", async () => {
  const context = getContext();
  const user = await context.getUserByEmail(userEmail);
  const publicUserData = getPublicUserData(user);
  await expect(login(context)).resolves.toMatchObject({
    user: publicUserData,
    token: UserToken.newToken({
      user,
      audience: [userEndpoints.login],
    }),
  });
});
