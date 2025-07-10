import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedInUser");

    if (token && user) {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (now < decoded.exp) {
        toast.success("Already logged in");
        navigate("/dashboard");
      } else {
        toast.error("Token expired");
        localStorage.clear();
        navigate("/login");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter all fields");
      return;
    }

    const user = { email, password };

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("You have successfully logged in");
        delete data.user.password;
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.token));
        navigate("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Error connecting to server");
    }
  };

  return (
    <div className="form-box">
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="label-input">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div className="label-input">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />                        

        <div className="buttons">
          <input className="btn" type="submit" value="Login" />
          <Link className="link-btn" to="/">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
