// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom"; // Updated import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginRegisterPage from "./App";
import "./index.css";
import Register from "./register";
import reportWebVitals from "./reportWebVitals";
import Result from "./result";
import useToken from "./useToken";

const RootComponent = () => {
  const { token, removeToken, setToken } = useToken();

  const PrivateRoute = ({ element, ...props }) => {
    return token ? element : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/recruit"
          element={<PrivateRoute element={<Result token={token} />} />}
        />
        <Route path="/" element={<LoginRegisterPage setToken={setToken} />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
