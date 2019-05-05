const userLoginFragement = `
  fragment userQueryResult on UserQueryResult {
    errors {
      field
      message
    }
    user {
      name
      email
      _id
      createdAt
      lastNotificationCheckTime
    }
    token
  }
`;

const userSignupMutation = `
  ${userLoginFragement}
  mutation UserSignupMutation ($user: UserSignupInput!) {
    user {
      signup (user: $user) {
        ...userQueryResult
      }
    }
  }
`;

const echoPostRequest = {
  url: "http://localhost:5000/graphql",
  method: "POST",
  header: "Content-Type: application/json\n",
  body: {
    mode: "raw",
    raw: JSON.stringify({
      query: userSignupMutation,
      variables: {
        user: {
          name: "Abayomi Akintomide",
          email: "ywordk@gmail.com",
          password: "abc123!"
        }
      }
    })
  }
};

pm.sendRequest(echoPostRequest, function(err, response) {
  console.log("Hello World!");
  console.log(response.json());
});
