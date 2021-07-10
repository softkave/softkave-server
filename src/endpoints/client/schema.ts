const clientSchema = `
type Client {
    clientId: String
    hasUserSeenNotificationsPermissionDialog: Boolean
    muteChatNotifications: Boolean
    isSubcribedToPushNotifications: Boolean
    isLoggedIn: Boolean
}

input UpdateClientDataInput {
    hasUserSeenNotificationsPermissionDialog: Boolean
    muteChatNotifications: Boolean
    isSubcribedToPushNotifications: Boolean
    isLoggedIn: Boolean
}

type UpdateClientResponse {
    errors: [Error]
    client: Client
}

type ClientQuery {
    
}

type ClientMutation {
    updateClient (data: UpdateClientDataInput!) : UpdateClientResponse
}
`;

export default clientSchema;
