import { lastIndexOf } from "lodash";
import appInfo from "../res/appInfo";

export function getFooterHTML() {
    return `
    <footer class="email-footer">
        <hr>
        &copy; ${appInfo.appName} ${new Date().getFullYear()}
    </footer>
    `;
}

export function getHeaderHTML(title) {
    return `
    <header class="email-header email-content-center">
        <h1>${appInfo.appName} | ${title}</h1>
        <hr>
    </header>
    `;
}

export function getHeaderText(title) {
    const textBlocks = [`${appInfo.appName} | ${title}`];
    return textBlocks.join("");
}

const maxWidth = 520;
const fontSize = 16;

export function getTemplateStylesHTML() {
    return `
    .email-header {
        text-align: left;
    }

    .email-header h1 {
        font-size: 16px;
    }

    .email-body {
        margin-top: 32px;
        margin-bottom: 32px;
    }

    .email-content-center {
        max-width: ${maxWidth}px;
        padding-left: 16px;
        padding-right: 16px;
        margin: auto;
    }

    .email-footer {
        max-width: ${maxWidth}px;
        margin: auto
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

export function breakText(text: string) {
    const lineLength = Math.floor(maxWidth / fontSize);
    const lines: string[] = [];

    for (
        let sliceIndex = 0;
        sliceIndex < text.length;
        sliceIndex += lineLength
    ) {
        lines.push(text.slice(sliceIndex, sliceIndex + lineLength));
    }

    return lines.join(getNewlines());
}
