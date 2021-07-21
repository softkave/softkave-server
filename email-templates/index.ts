import {
    renderAssignedTaskEmailToFile,
    renderCollaborationRequestEmailToFile,
    renderConfirmEmailAddressMedia,
    renderForganizationotPasswordEmailToFile,
} from "../src/html/renderToFile";

console.log("Writing templates");

renderCollaborationRequestEmailToFile();
renderForganizationotPasswordEmailToFile();
renderAssignedTaskEmailToFile();
renderConfirmEmailAddressMedia();

console.log("Completed writing templates");
