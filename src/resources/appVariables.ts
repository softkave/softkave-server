const clientDomain = process.env.CLIENT_DOMAIN || "https://www.softkave.com";

export const appVariables = {
    clientDomain,
    mongoDbURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    feedbackBoardId: process.env.FEEDBACK_BOARD_ID,
    feedbackUserId: process.env.FEEDBACK_USER_ID,
    port: process.env.PORT,
    appName: "Softkave",
    emailSendFrom: "hello@softkave.com",
    emailEncoding: "UTF-8",
    dateFormat: "MMM DD, YYYY",
    loginLink: `${clientDomain}/login`,
};

export type IAppVariables = typeof appVariables;
