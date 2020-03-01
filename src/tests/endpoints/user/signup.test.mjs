import { signup } from "../../user-utils.mjs";

const user = {
  name: "Abayomi Akintomide",
  password: "Abayomi_Akintomide_02",
  email: "abayomi@softkave.com",
  color: "#AABBCC"
};

const signupTest = async () => {
  const result = await signup(user);
  console.dir(result);
};

signupTest();
