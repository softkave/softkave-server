"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appInfo_1 = __importDefault(require("../res/appInfo"));
const styles = `
*{
  margin: 0;
  padding: 0;
}

.d-table {
  display:table!important;
}

html {
  font-family:sans-serif;
  line-height:1.15;
  -webkit-text-size-adjust:100%;
  -ms-text-size-adjust:100%;
  -ms-overflow-style:scrollbar;
  -webkit-tap-highlight-color:transparent;
}

.float-none {
  float:none!important;
  text-align: left;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 24px;
}

body {
  align-content: center;
  margin-top:5%;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size:1rem;
  font-weight:400;
  line-height:1.5;
  color:#212529;
  text-align:center;
  background-color:#fff;
}
body .sk-header-2{
  padding: 2%;
  border-radius: 5px;
  background-color: #eee;
}
.float-left {
  float:left!important;
}

.clear{
  margin-top: 2%
}
.clear-side{
 margin-top: 2%;
}

img {
  vertical-align: auto;
  border-style:none;
}
.line{
  clear: both;
  margin: 4% auto;
  width: 90%;
  height: 2px;
  background-color: #e3e9e9;
}
`;
function html(content) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${appInfo_1.default.appName}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <style>${styles}</style>
      </head>
      <body>
          <div class="">
            <!-- <img class="" src="assets/img/test.png" /> -->
            <!--<h1>Softkave</h1>
            <div class="clear-side"></div> -->
            <!-- <i
              class="fa fa-facebook-f "
              style="font-size:24px;height:auto;margin:24px;"
            ></i>
            <i
              class="fa fa-instagram "
              style="font-size:24px;height:auto;margin:24px;"
            ></i>
            <i
              class="fa fa-twitter "
              style="font-size:24px;height:auto;margin:24px;"
            ></i> -->
          </div>
          <div class="clear"></div>
          ${content}
          <p
            style="text-align: center; margin: 18px 0; color: #333; font-weight: bold;"
          >
            &copy; Softkave<br />
          </p>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  `;
}
exports.html = html;
//# sourceMappingURL=util.js.map