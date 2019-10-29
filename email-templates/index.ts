import renderCollaborationRequestEmailToFile from "../src/html/render/collaborationRequestEmailToFile";
import renderForgotPasswordEmailToFile from "../src/html/render/forgotPasswordEmailToFile";

console.log("Writing templates");
renderCollaborationRequestEmailToFile();
renderForgotPasswordEmailToFile();
console.log("Completed writing templates");
