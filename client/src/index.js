import { CssBaseline } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import App from "./App";
import { RTL } from "./components/RTL";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import "./services/authService";
import { authService } from "./services/authService";
import AxiosInstance from "./services/axios-instance";
import "./services/captain";
import store from "./store";
import { useHistory } from "react-router-dom";

AxiosInstance.defaults.baseURL = getBaseUrl();

function getBaseUrl() {
  let currentEnvUrl = window.location.origin
  let urlDic = {

  }

  return urlDic[currentEnvUrl];
}


AxiosInstance.post('users/refreshToken').then(t => {


  if (t.data === "failed") {

    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
      return
    }


  } else {
    authService.updateUser(t.data)
  }

  ReactDOM.render(
    <div>
      {/* <React.StrictMode> */}
      <Helmet>
        <script src="https://captainup.com/assets/sdk.js"></script>
      </Helmet>
      <CssBaseline />
      <RTL>
        <Provider store={store}>
          <App />
        </Provider>
      </RTL>
      {/* </React.StrictMode> */}
    </div>,
    document.getElementById("root")
  );

})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
