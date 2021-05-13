// import argon2 from "argon2";
// import { IUser } from "../../../mongo/user";
// import { getDate } from "../../../utilities/fns";
// import { IBaseContext } from "../../contexts/BaseContext";
// import RequestData from "../../RequestData";
// import { JWTEndpoints } from "../../types";
// import { InvalidEmailOrPasswordError } from "../errors";
// import UserToken from "../../contexts/UserTokenContext";
// import { getPublicUserData } from "../utils";
// import login from "./login";
// import { ILoginParameters } from "./types";

// const userEmail = "ywordk@gmail.com";
// const correctPassword = "01234567";
// const incorrectPassword = "abcdefgh";
// const now = getDate();

// const getInstanceData = ({ useIncorrectPassword = false } = {}) => {
//     const instData: RequestData<ILoginParameters> = {
//         data: {
//             email: userEmail,
//             password: useIncorrectPassword
//                 ? incorrectPassword
//                 : correctPassword,
//         },
//         req: {} as any,
//         ips: [],
//     };

//     return instData;
// };

// const getContext = () => {
//     const context: IBaseContext = {
//         user: {
//             async getUserByEmail() {
//                 const user = {
//                     email: userEmail,
//                     hash: await argon2.hash(correctPassword),
//                     customId: "",
//                     name: "Abayomi Akintomide",
//                     createdAt: now,
//                     forgotPasswordHistory: [],
//                     passwordLastChangedAt: now,
//                     notificationsLastCheckedAt: now,
//                     rootBlockId: "",
//                     orgs: [{ customId: "" }],
//                     color: "",
//                 } as IUser;

//                 return user;
//             },
//         } as any,
//     } as any;

//     return context;
// };

// beforeAll(() => {
//     process.env.JWT_SECRET = "fake-secret";
// });

// test("prevents login if password is incorrect", async () => {
//     const context = getContext();
//     const instData = getInstanceData({ useIncorrectPassword: true });
//     await expect(login(context, instData)).rejects.toThrowError(
//         InvalidEmailOrPasswordError
//     );
// });

// test("allow login if password is correct", async () => {
//     const context = getContext();
//     const instData = getInstanceData();
//     const user = await context.user.getUserByEmail(context, userEmail);
//     const publicUserData = getPublicUserData(user);

//     await expect(login(context, instData)).resolves.toMatchObject({
//         user: publicUserData,
//         token: UserToken.newToken({
//             user,
//             audience: [JWTEndpoints.Login],
//         }),
//     });
// });
