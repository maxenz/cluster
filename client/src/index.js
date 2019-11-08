import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "semantic-ui-css/semantic.min.css";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

ReactDOM.render(
  <div>
    <ReactNotification />
    <App />
  </div>,
  document.getElementById("root")
);
registerServiceWorker();
