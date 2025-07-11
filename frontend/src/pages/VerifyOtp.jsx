import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Email not found. Please login again.");
      navigate("/login");
      return;
    }
    const user = { email: email, otp: otp };

    try {
      const res = await fetch("http://localhost:3000/verify-otp", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        toast.success("OTP verified");
        delete data.user.password;
        navigate("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Invalid OTP");
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
          <label htmlFor="otp">OTP: </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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

export default VerifyOtp;
