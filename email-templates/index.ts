import {
    renderAssignedTaskEmailToFile,
    renderCollaborationRequestEmailToFile,
    renderConfirmEmailAddressMedia,
    renderForgotPasswordEmailToFile,
} from "../src/html/renderToFile";

console.log("Writing templates");

renderCollaborationRequestEmailToFile();
renderForgotPasswordEmailToFile();
renderAssignedTaskEmailToFile();
renderConfirmEmailAddressMedia();

console.log("Completed writing templates");
