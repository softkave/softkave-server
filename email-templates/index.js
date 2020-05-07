import renderCollaborationRequestEmailToFile from "../src/html/render/collaborationRequestEmailToFile";
import renderForgotPasswordEmailToFile from "../src/html/render/forgotPasswordEmailToFile";
import renderAssignedTaskEmailNotification from "../src/html/render/assignedTaskEmailToFile";

console.log("Writing templates");
renderCollaborationRequestEmailToFile();
renderForgotPasswordEmailToFile();
renderAssignedTaskEmailNotification();
console.log("Completed writing templates");
