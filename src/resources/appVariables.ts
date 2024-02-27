const clientDomain = process.env.CLIENT_DOMAIN || 'https://www.softkave.com';

function getBoolean(value = '') {
  return value.toLowerCase() === 'true';
}

export interface IAppVariables {
  // environment variables
  clientDomain: string;
  mongoDbURI: string;
  dbName: string;
  jwtSecret: string;
  nodeEnv: string;
  feedbackBoardId: string;
  feedbackUserId: string;
  port: string;
  vapidPublicKey: string;
  vapidPrivateKey: string;
  disableEmail: boolean;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;

  appName: string;
  emailSendFrom: string;
  emailEncoding: string;
  dateFormat: string;
  signupPath: string;
  loginPath: string;
  changePasswordPath: string;
  confirmEmailAddressPath: string;
}

/**
 * Maybe not the best practice, but it's okay coerce the env variables below as
 * long as checkVariablesExist is called before using them which it is when
 * creating a BaseContext.
 *
 * TODO: refactor to check the env variables exists when
 * getting them
 */
export const appVariables: IAppVariables = {
  clientDomain,
  mongoDbURI: process.env.MONGODB_URI!,
  dbName: process.env.DB_NAME!,
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv: process.env.NODE_ENV!,
  feedbackBoardId: process.env.FEEDBACK_BOARD_ID!,
  feedbackUserId: process.env.FEEDBACK_USER_ID!,
  port: process.env.PORT!,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY!,
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY!,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  awsRegion: process.env.AWS_REGION!,
  disableEmail: getBoolean(process.env.DISABLE_EMAIL),

  appName: 'Softkave',
  emailSendFrom: 'Boards@softkave.com',
  emailEncoding: 'UTF-8',
  dateFormat: 'MMM DD, YYYY',
  signupPath: `${clientDomain}/signup`,
  loginPath: `${clientDomain}/login`,
  changePasswordPath: `${clientDomain}/change-password`,
  confirmEmailAddressPath: `${clientDomain}/confirm-email-address`,
};

export function checkVariablesExist() {
  let requiredVariablesMissing = false;
  const messages: string[] = [];
  const logIfMissing = (key: string, value: any) => {
    if (!value) {
      messages.push(`Env variable ${key} not set`);
      requiredVariablesMissing = true;
    }
  };

  logIfMissing('CLIENT_DOMAIN', appVariables.clientDomain);
  logIfMissing('MONGODB_URI', appVariables.mongoDbURI);
  logIfMissing('DB_NAME', appVariables.dbName);
  logIfMissing('JWT_SECRET', appVariables.jwtSecret);
  logIfMissing('NODE_ENV', appVariables.nodeEnv);
  logIfMissing('FEEDBACK_BOARD_ID', appVariables.feedbackBoardId);
  logIfMissing('FEEDBACK_USER_ID', appVariables.feedbackUserId);
  logIfMissing('PORT', appVariables.port);
  logIfMissing('VAPID_PUBLIC_KEY', appVariables.vapidPublicKey);
  logIfMissing('VAPID_PRIVATE_KEY', appVariables.vapidPrivateKey);
  logIfMissing('AWS_ACCESS_KEY_ID', appVariables.vapidPrivateKey);
  logIfMissing('AWS_SECRET_ACCESS_KEY', appVariables.vapidPrivateKey);
  logIfMissing('AWS_REGION', appVariables.vapidPrivateKey);
  if (messages.length > 0) {
    throw new Error(['Required env variables missing'].concat(messages).join('\n'));
  }
}
