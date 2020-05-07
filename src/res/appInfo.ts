const clientDomain = process.env.CLIENT_DOMAIN || "https://www.softkave.com";

const appInfo = {
  appName: "Softkave",
  clientDomain,
  defaultEmailSender: "softkave@softkave.com",
  defaultEmailEncoding: "UTF-8",
  defaultDateFormat: "MMM DD, YYYY",
  loginLink: `${clientDomain}/login`,
};

export default appInfo;
