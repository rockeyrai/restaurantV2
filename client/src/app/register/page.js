"use client";
import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userData = JSON.stringify(formData);
      alert(userData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_API}/register`, // Environment variable without 'NEXT_PUBLIC' duplication
        formData
      );

      console.log("Registration successful");
      setSuccess(true);

      // Reset form data after successful submission
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          autoComplete="tel"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Registration successful!</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
