import { appVariables } from "../resources/appVariables";

export function getFooterHTML() {
    return `
    <footer class="email-footer">
        <hr>
        &copy; ${appVariables.appName} ${new Date().getFullYear()}
    </footer>
    `;
}

export function getHeaderHTML(title) {
    return `
    <header class="email-header email-content-center">
        <h1>${appVariables.appName} | ${title}</h1>
        <hr>
    </header>
    `;
}

export function getHeaderText(title) {
    const textBlocks = [`${appVariables.appName} | ${title}`];
    return textBlocks.join("");
}

const maxWidth = 500;

export function getTemplateStylesHTML() {
    return `
    body {
        margin-top: 32px;
        margin-bottom: 32px;
        max-width: ${maxWidth}px;
        padding-left: 16px;
        padding-right: 16px;
        margin: auto;
    }

    .email-header {
        text-align: left;
        margin-bottom: 32px;
    }

    .email-header h1 {
        font-size: 24px;
    }

    .email-footer {
        margin-top: 32px;
    }
    `;
}

export function getEndGreeting() {
    return "Have a nice day!";
}

export function getNewlines(count = 1) {
    let newlines = "";

    while (count > 0) {
        newlines += "\n";
        count--;
    }

    return newlines;
}
