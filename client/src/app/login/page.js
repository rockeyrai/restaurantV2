'use client';

import { loginUser, logoutUser } from "@/storage/redux/slice/userSlice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error, userInfo } = useSelector((state) => state.user);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // Hydration state

  useEffect(() => {
    setIsHydrated(true); // Mark as hydrated after the client-side render
  }, []);

  useEffect(() => {
    if (isFormSubmitted) {
      dispatch(loginUser(credentials));
      setIsFormSubmitted(false);
    }
  }, [isFormSubmitted, credentials, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      alert("Please fill in both email and password");
      return;
    }
    setIsFormSubmitted(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (!isHydrated) return null; // Ensure nothing is rendered before hydration

  return (
    <div>
      <h2>Login</h2>

      {/* Show login form if not logged in */}
      {!userInfo ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : (
        <div>
          <h3>Welcome, {userInfo.username}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
