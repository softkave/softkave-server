import assert from "assert";

const clientDomain = process.env.CLIENT_DOMAIN || "https://www.softkave.com";

function getBoolean(value: string = "") {
    return value.toLowerCase() === "true";
}

function getNumber(value: string = "", envName: string) {
    const num = Number(value);
    assert.ok(Number.isNaN(num), `${envName} is not a number`);
    return num;
}

export const appVariables = {
    clientDomain,
    mongoDbURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    feedbackBoardId: process.env.FEEDBACK_BOARD_ID,
    feedbackUserId: process.env.FEEDBACK_USER_ID,
    port: process.env.PORT,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    disableEmail: getBoolean(process.env.DISABLE_EMAIL),

    appName: "Softkave",
    emailSendFrom: "hello@softkave.com",
    emailEncoding: "UTF-8",
    dateFormat: "MMM DD, YYYY",
    signupPath: `${clientDomain}/signup`,
    loginPath: `${clientDomain}/login`,
    changePasswordPath: `${clientDomain}/change-password`,
    confirmEmailAddressPath: `${clientDomain}/confirm-email-address`,
};

function checkVariablesExist() {
    let requiredVariablesMissing = false;

    const logIfMissing = (key, value) => {
        if (!value) {
            console.log(`Env variable ${key} not set`);
            requiredVariablesMissing = true;
        }
    };

    logIfMissing("CLIENT_DOMAIN", appVariables.clientDomain);
    logIfMissing("MONGODB_URI", appVariables.mongoDbURI);
    logIfMissing("JWT_SECRET", appVariables.jwtSecret);
    logIfMissing("NODE_ENV", appVariables.nodeEnv);
    logIfMissing("FEEDBACK_BOARD_ID", appVariables.feedbackBoardId);
    logIfMissing("FEEDBACK_USER_ID", appVariables.feedbackUserId);
    logIfMissing("PORT", appVariables.port);
    logIfMissing("VAPID_PUBLIC_KEY", appVariables.vapidPublicKey);
    logIfMissing("VAPID_PRIVATE_KEY", appVariables.vapidPrivateKey);

    if (requiredVariablesMissing) {
        throw new Error("Required env variables missing");
    }
}

checkVariablesExist();

export type IAppVariables = typeof appVariables;
