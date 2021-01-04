import argon2 from "argon2";
import { noop } from "lodash";
import { Server, Socket } from "socket.io";
import { IUser } from "../mongo/user";
import { appVariables } from "../resources/appVariables";
import cast, { getDate } from "../utilities/fns";
import getNewId from "../utilities/getNewId";
import { getBaseContext, IBaseContext } from "./contexts/BaseContext";
import { IServerRequest } from "./contexts/types";
import RequestData from "./RequestData";
import { JWTEndpoints } from "./types";
import UserToken, { IBaseUserTokenData } from "./user/UserToken";

const testClientId = getNewId();
const testUserAgent = "server-test-123";
const testJWTSecret = "test-secret";

let testUser: IUser;
let testTokenData: IBaseUserTokenData;
let testToken: string;

export async function getTestUser() {
    if (testUser) {
        return testUser;
    }

    testUser = {
        email: "abayomi@softkave.com",
        hash: await argon2.hash("password"),
        customId: "",
        name: "Abayomi Akintomide",
        createdAt: getDate(),
        forgotPasswordHistory: [],
        passwordLastChangedAt: getDate(),
        notificationsLastCheckedAt: getDate(),
        rootBlockId: "",
        orgs: [{ customId: "" }],
        color: "",
    };

    return testUser;
}

export async function getTestUserTokenData() {
    if (testTokenData) {
        return testTokenData;
    }

    const user = await getTestUser();
    const data = UserToken.newUserTokenData({
        user,
        audience: [JWTEndpoints.Universal],
        clientId: testClientId,
    });

    testTokenData = {
        ...data,
        iat: Date.now() / 1000,
    };

    return testTokenData;
}

export async function getTestToken() {
    if (testToken) {
        return testToken;
    }

    const user = await getTestUser();
    testToken = UserToken.newToken({
        user,
        audience: [JWTEndpoints.Universal],
        clientId: testClientId,
    });

    return testToken;
}

export async function getTestExpressRequest() {
    const partialRequest: Partial<IServerRequest> = {
        user: await getTestUserTokenData(),
        headers: {
            ["user-agent"]: testUserAgent,
            ["x-client-id"]: testClientId,
        },
    };

    return cast<IServerRequest>(partialRequest);
}

export function getTestSocket() {
    const partialSocket: Partial<Socket> = {
        id: "",
    };

    return cast<Socket>(partialSocket);
}

export async function getTestExpressRequestData() {
    return RequestData.fromExpressRequest(await getTestExpressRequest());
}

export async function getTestSocketRequestData() {
    return RequestData.fromSocketRequest(getBaseContext(), getTestSocket(), {
        token: await getTestToken(),
    });
}

export function getTestBaseContext() {
    const ctx: IBaseContext = {
        appVariables,
        block: {
            getBlockById: noop as any,
            getBlockByName: noop as any,
            bulkGetBlocksByIds: noop as any,
            updateBlockById: noop as any,
            saveBlock: noop as any,
            deleteBlock: noop as any,
            getBlockChildren: noop as any,
            getUserRootBlocks: noop as any,
            bulkUpdateTaskSprints: noop as any,
            blockExists: noop as any,
            assertGetBlockById: noop as any,
        },
        user: {
            getUserByEmail: noop as any,
            bulkGetUsersByEmail: noop as any,
            getUserById: noop as any,
            updateUserById: noop as any,
            bulkGetUsersById: noop as any,
            saveUser: noop as any,
            userExists: noop as any,
            getBlockCollaborators: noop as any,
            getOrgUsers: noop as any,
            bulkUpdateUsersById: noop as any,
        },
        collaborationRequest: {
            getCollaborationRequestById: noop as any,
            getUserCollaborationRequests: noop as any,
            updateCollaborationRequestById: noop as any,
            deleteCollaborationRequestById: noop as any,
            getCollaborationRequestsByRecipientEmail: noop as any,
            bulkSaveCollaborationRequests: noop as any,
            getCollaborationRequestsByBlockId: noop as any,
            saveCollaborationRequest: noop as any,
        },
        notification: {
            bulkSaveNotificationSubscriptions: noop as any,
            bulkSaveNotifications: noop as any,
            deleteNotificationById: noop as any,
            getNotificationById: noop as any,
            getNotificationSubscriptionById: noop as any,
            getNotificationSubscriptionsByResourceId: noop as any,
            getNotificationsByOrgId: noop as any,
            getUserNotifications: noop as any,
            getUserNotificationsById: noop as any,
            markUserNotificationsRead: noop as any,
            updateNotificationById: noop as any,
            updateNotificationSubscriptionById: noop as any,
        },
        auditLog: {
            insert: noop as any,
            insertMany: noop as any,
        },
        session: {
            addUserToSession: noop as any,
            getUser: noop as any,
            getRequestToken: noop as any,
            updateUser: noop as any,
            assertUser: noop as any,
            validateUserTokenData: noop as any,
            validateUserToken: noop as any,
            tryGetUser: noop as any,
            clearCachedUserData: noop as any,
        },
        // note: {
        //     getNoteById: noop as any,
        //     updateNoteById: noop as any,
        //     markNoteDeleted: noop as any,
        //     getNotesByBlockId: noop as any,
        //     saveNote: noop as any,
        //     getNoteByName: noop as any,
        //     noteExists: noop as any,
        // },
        accessControl: {
            assertPermission: noop as any,
            assertPermissions: noop as any,
            bulkUpdatePermissionGroupsById: noop as any,
            bulkUpdatePermissionsById: noop as any,
            deletePermissionGroups: noop as any,
            deletePermissions: noop as any,
            deleteUserAssignedPermissionGroupsByPermissionGroupId: noop as any,
            deleteUserAssignedPermissionGroupsByUserAndPermissionGroupIds: noop as any,
            getPermissionGroupsById: noop as any,
            getPermissionGroupsByLowerCasedNames: noop as any,
            getPermissionGroupsByResourceId: noop as any,
            getPermissionsByResourceId: noop as any,
            getResourcePermissions: noop as any,
            getUserAssignedPermissionGroups: noop as any,
            permissionGroupExists: noop as any,
            queryPermission: noop as any,
            queryPermissions: noop as any,
            savePermissionGroups: noop as any,
            savePermissions: noop as any,
            saveUserAssignedPermissionGroup: noop as any,
            updatePermission: noop as any,
            updatePermissionGroup: noop as any,
        },
        socket: {
            assertSocket: noop as any,
            mapUserToSocketId: noop as any,
            disconnectSocket: noop as any,
            disconnectUser: noop as any,
            getUserIdBySocketId: noop as any,
            attachSocketToRequestData: noop as any,
            getUserSocketEntries: noop as any,
        },
        room: {
            subscribe: noop as any,
            subscribeUser: noop as any,
            unSubscribeUser: noop as any,
            leave: noop as any,
            broadcast: noop as any,
            isUserInRoom: noop as any,
            getBlockRoomName: noop as any,
            // getNoteRoomName: noop as any,
            getUserRoomName: noop as any,
            getChatRoomName: noop as any,
        },
        broadcastHistory: {
            insert: noop as any,
            fetch: noop as any,
        },
        models: {
            userModel: {} as any,
            blockModel: {} as any,
            notificationModel: {} as any,
            auditLogModel: {} as any,
            commentModel: {} as any,
            sprintModel: {} as any,
            chatModel: {} as any,
            roomModel: {} as any,
            collaborationRequestModel: {} as any,
            notificationSubscriptionModel: {} as any,
            permissionGroup: {} as any,
            permissions: {} as any,
            userAssignedPermissionGroup: {} as any,
        },
        socketServer: cast<Server>({}),
        comment: {
            createComment: noop as any,
            getComments: noop as any,
        },
        sprint: {
            saveSprint: noop as any,
            getSprintById: noop as any,
            getSprintsByBoardId: noop as any,
            updateSprintById: noop as any,
            bulkUpdateSprintsById: noop as any,
            sprintExists: noop as any,
            deleteSprint: noop as any,
            updateUnstartedSprints: noop as any,
            getMany: noop as any,
        },
        chat: {
            getMessages: noop as any,
            getRooms: noop as any,
            getRoomById: noop as any,
            addMemberToRoom: noop as any,
            updateMemberReadCounter: noop as any,
            insertMessage: noop as any,
            insertRoom: noop as any,
            getUserRoomReadCounter: noop as any,
        },
        broadcastHelpers: {
            broadcastBlockUpdate: noop as any,
            broadcastNewOrgCollaborationRequests: noop as any,
            broadcastNewUserCollaborationRequest: noop as any,
            broadcastUserUpdate: noop as any,
            broadcastCollaborationRequestsUpdateToBlock: noop as any,
            broadcastCollaborationRequestsUpdateToUser: noop as any,
            broadcastCollaborationRequestResponse: noop as any,
            broadcastNewRoom: noop as any,
            broadcastNewMessage: noop as any,
            broadcastRoomReadCounterUpdate: noop as any,
            broadcastNewSprint: noop as any,
            broadcastSprintUpdate: noop as any,
            broadcastEndSprint: noop as any,
            broadcastStartSprint: noop as any,
            broadcastDeleteSprint: noop as any,
        },
    };

    return ctx;
}

export function setupTestEnvVariables() {
    process.env.JWT_SECRET = testJWTSecret;
}
