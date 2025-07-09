import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      toast.error("Please enter all fields");
      return;
    }

    const user = { phoneNumber, password };

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
          <label htmlFor="phone-number">Phone Number: </label>
          <input
            type="text"
            id="phone-number"
            name="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <a className="link-btn" href="/">
            Back
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
