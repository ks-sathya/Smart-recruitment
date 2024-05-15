// LoginRegisterPage.jsx
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Form, FormGroup, Input } from "reactstrap";
// import "./login_registers.css" 
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import TextField from "@mui/material/TextField";

import "./LoginRegisterPage.css"; // Import the CSS file for styling

const LoginRegisterPage = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false); // State for login error
  const [emptyInputError, setEmptyInputError] = useState(false); // State for empty input error
  const [openModal, setOpenModal] = useState(false); // State to control modal

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const BootstrapButton = styled(Button)({
    boxShadow: "none",
    textTransform: "none",
    fontSize: 12,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#0063cc",
    borderColor: "#0063cc",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.message);
      const { access_token, message } = response.data;
      if (access_token) {
        // Update the state with the token
        props.setToken(access_token);

        // Save the token to local storage
        localStorage.setItem("token", access_token); // Navigate to the "/recruit" route
        navigate("/recruit");
      } else {
        console.log(message);
      } // You can handle the success message accordingly
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Please check your email and password");
      } else {
        toast.error("Something went wrong please try again");
      }
    }
  };

  const handleRegister = () => {
    // Handle registration logic
    navigate("/register");
    console.log("Registering with:", { username, password });
  };

  return (
    <div className="login-register-page">
      <Container>
        <Form className="login-register-form">
          <h1 style = {{color: "#12192c"}}>Login</h1>
          {/* {emptyInputError && (
            <Alert color="danger">
              Please enter both username and password.
            </Alert>
          )} */}
          {/* {loginError && (
            <Alert color="danger">Invalid credentials. Please try again.</Alert>
          )} */}
          <FormGroup
            className={`custom-input ${emptyInputError ? "error" : ""}`}
          >
            <TextField
              id="outlined-required"
              style={{ marginBottom: "0.5rem" }}
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email ID"
            />
          </FormGroup>
          <FormGroup
            className={`custom-input ${emptyInputError ? "error" : ""}`}
          >
            <TextField
              id="outlined-password-input"
              style={{ margin: "0.5rem" }}
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
            />
          </FormGroup>
          <div>
            <Button onClick={handleRegister} color="error">
              Register
            </Button>
            <BootstrapButton
              style={{ marginLeft: "12rem", marginRight: "0.5rem" }}
              onClick={handleLogin}
              variant="contained"
              disableRipple
            >
              Login
            </BootstrapButton>
          </div>
        </Form>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default LoginRegisterPage;
