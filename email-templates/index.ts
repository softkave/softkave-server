import {
  renderCollaborationRequestEmailToFile,
  renderConfirmEmailAddressMedia,
  renderForganizationotPasswordEmailToFile,
} from '../src/html/renderToFile';

console.log('Writing templates');

renderCollaborationRequestEmailToFile();
renderForganizationotPasswordEmailToFile();
renderConfirmEmailAddressMedia();

console.log('Completed writing templates');
