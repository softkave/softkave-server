const {
  userSignupMutation,
  userLoginMutation,
  updateUserMutation,
  changePasswordMutation,
  forgotPasswordMutation,
  userExistsQuery,
  updateCollaborationRequestMutation,
  changePasswordWithTokenMutation,
  respondToCollaborationRequestMutation,
  getCollaborationRequestsQuery
} = require("./query/user");
const {
  addBlockMutation,
  updateBlockMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  getBlocksQuery,
  addCollaboratorsMutation,
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getPermissionBlocksQuery
} = require("./query/block");
const request = null;
const get = null;

async function r({
  query,
  variables,
  path,
  auth
}) {
  let headers = {};

  if (auth) {
    headers = {
      "Authorization": `Bearer ${auth}`
    };
  } else if (auth === false) {
    throw new Error("no authorization token provided");
  }

  let result = await request(
    "http://localhost:3000/graphql", {
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    }
  );

  let data = get(result, path);
  console.log(data);

  if (!data) {
    throw new Error("there is no data returned");
  } else if (data.error) {
    throw new Error("valid query and variables returned error");
  }

  return data;
}

let user = {
  token: false
};

function afterAll() {
  if (user) {
    //delete user
  }
}

// make sure tests don't run in parallel because of signup user
// install request-promise-native or axios

describe("user", () => {
  test("signup", async () => {
    user = await r({
      query: userSignupMutation,
      variables: {
        firstName: "Abayomi",
        lastName: "Akintomide",
        email: "ywordk@gmail.com",
        passowrd: "a"
      },
      path: "data.user.signup"
    })
  });

  test("login", async () => {
    user = await r({
      query: userLoginMutation,
      variables: {
        
      },
      path: "data.user.login"
    })
  });

  test("update", async () => {
    user = await r({
      query: updateUserMutation,
      variables: {
        
      },
      path: "data.user.updateUser"
    })
  });

  test("change password", async () => {
    user = await r({
      query: changePasswordMutation,
      variables: {
        
      },
      path: "data.user.changePassword"
    })
  });

  test("forgot password", async () => {
    user = await r({
      query: forgotPasswordMutation,
      variables: {
        
      },
      path: "data.user.forgotPassword"
    })
  });

  // test("user exists", async () => {
  //   user = await r({
  //     query: userExistsQuery,
  //     variables: {
        
  //     },
  //     path: "data.user.userExists"
  //   })
  // });

  test("update collaboration request", async () => {
    user = await r({
      query: updateCollaborationRequestMutation,
      variables: {
        
      },
      path: "data.user.updateCollaborationRequest"
    })
  });

  test("change password with token", async () => {
    user = await r({
      query: changePasswordWithTokenMutation,
      variables: {
        
      },
      path: "data.user.changePasswordWithToken"
    })
  });

  test("respond to collaboration request", async () => {
    user = await r({
      query: respondToCollaborationRequestMutation,
      variables: {
        
      },
      path: "data.user.respondToCollaborationRequest"
    })
  });

  test("get collaboration requests", async () => {
    user = await r({
      query: getCollaborationRequestsQuery,
      variables: {
        
      },
      path: "data.user.getCollaborationRequests"
    })
  });
});

describe("block", () => {
  test("add org", () => {
    return r({
      query: addBlockMutation,
      variables: {

      },
      path: "data.block.addBlock"
    });
  });

  test("add project to org", () => {
    return r({
      query: addBlockMutation,
      variables: {

      },
      path: "data.block.addBlock"
    });
  });

  test("add group to org", () => {
    return r({
      query: addBlockMutation,
      variables: {

      },
      path: "data.block.addBlock"
    });
  });

  test("add task to org", () => {
    return r({
      query: addBlockMutation,
      variables: {

      },
      path: "data.block.addBlock"
    });
  });

  test("toggle task", () => {
    return r({
      query: addBlockMutation,
      variables: {

      },
      path: "data.block.addBlock"
    });
  });

  test("update", () => {
    return r({
      query: updateBlockMutation,
      variables: {

      },
      path: "data.block.updateBlock"
    });
  });

  test("update roles", () => {
    return r({
      query: updateBlockMutation,
      variables: {

      },
      path: "data.block.updateBlock"
    });
  });

  test("update acl", () => {
    return r({
      query: updateBlockMutation,
      variables: {

      },
      path: "data.block.updateBlock"
    });
  });

  test("get block children", () => {
    return r({
      query: getBlockChildrenQuery,
      variables: {

      },
      path: "data.block.getBlockChildren"
    });
  });

  test("get blocks", () => {
    return r({
      query: getBlocksQuery,
      variables: {

      },
      path: "data.block.getBlocks"
    });
  });

  test("add collaborators", () => {
    return r({
      query: addCollaboratorsMutation,
      variables: {

      },
      path: "data.block.addCollaborators"
    });
  });

  test("get collab requests", () => {
    return r({
      query: getCollabRequestsQuery,
      variables: {

      },
      path: "data.block.getCollabRequests"
    });
  });

  test("get collaborators", () => {
    return r({
      query: getCollaboratorsQuery,
      variables: {

      },
      path: "data.block.getCollaborators"
    });
  });

  test("get permission blocks", () => {
    return r({
      query: getPermissionBlocksQuery,
      variables: {

      },
      path: "data.block.getPermissionBlocks"
    });
  });

  test("delete", () => {
    return r({
      query: deleteBlockMutation,
      variables: {

      },
      path: "data.block.addBlock"
    });
  });
});