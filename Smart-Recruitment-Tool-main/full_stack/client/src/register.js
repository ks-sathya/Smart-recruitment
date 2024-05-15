import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    // Add your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters and contain one capital letter or special character
    const passwordRegex = /^(?=.*[A-Z!@#$%^&*()_+{}|:"<>?])[\S]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!validateEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters and contain one capital letter or special character");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      navigate("/");
    } catch (error) {
      console.error("Axios error:", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="register-container">
      <h1 className="big-font">Registration</h1>
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
          <label htmlFor="name">Enter Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="email">Enter Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="number">Phone Number</label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>
  
  
        <button type="submit">Register</button>
        
      

      </form>
  
      <p>
        Already have an account? 
      </p>
      <div className="button-group">
        <button type="button" onClick={() => navigate("/")}>
          Log in here
        </button>
      </div>

      
      
      <ToastContainer />
    </div>
  );
  
};

export default Register;
