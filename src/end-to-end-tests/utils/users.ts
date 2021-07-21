import { INewUserInput } from "../../endpoints/user/signup/types";

// Default user
const user0: INewUserInput = {
    name: "Test User 00",
    email: "demo-user-00@softkave.com",
    password: "demo-password-00",
    color: "#36B37E",
};

const user1: INewUserInput = {
    name: "Test User 01",
    email: "demo-user-01@softkave.com",
    password: "demo-password-01",
    color: "#6554C0",
};

const user2: INewUserInput = {
    name: "Test User 02",
    email: "demo-user-02@softkave.com",
    password: "demo-password-02",
    color: "#00B8D9",
};

const user3: INewUserInput = {
    name: "Test User 03",
    email: "demo-user-03@softkave.com",
    password: "demo-password-03",
    color: "#FFAB00",
};

async function createOrGetDefaultUser() {}

export { user0, user1, user2, user3 };
