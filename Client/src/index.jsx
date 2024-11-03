import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import store from "./app/store";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
);
