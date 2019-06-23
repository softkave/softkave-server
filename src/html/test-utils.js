window.loadingScriptsCount = 0;
window.loadedScripts = [];
window.module = {};
window.process = {
  env: {
    CLIENT_DOMAIN: "www.softkave.com"
  }
};

var resources = {
  ["../res/app"]: { appName: "Softkave" }
};

window.require = function(path) {
  // if (window.loadedScripts.indexOf(path) === -1) {
  //   var script = new HTMLScriptElement();
  //   script.src = path;
  //   window.loadingScripts += 1;
  //   window.loadedScripts.push(path);

  //   script.onerror = function() {
  //     throw new Error(`Error loading script ${path}`);
  //   };

  //   script.onload = function() {
  //     window.loadingScripts -= 1;
  //   };

  //   window.document.body.appendChild(script);
  // }

  return {};
};

function insertHTML(content) {
  window.document.documentElement.innerHTML = content;
}

function insertHTMLFromFunction(func) {
  while (window.loadedScripts > 0) {}

  var content = func();
  window.document.documentElement.innerHTML = content;
}
