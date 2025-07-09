import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Register = () => {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    phoneNumber: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fname, lname, age, phoneNumber, password, confirmPassword } = form;

    if (
      !fname ||
      !lname ||
      !age ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = { fname, lname, age, phoneNumber, password };

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        toast.success("Registration successful");
        navigate("/");
      } else {
        const data = await res.json();
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error registering");
    }
  };

  return (
    <div className="form-box">
      <form onSubmit={handleSubmit}>
        {[
          ["First Name", "fname"],
          ["Last Name", "lname"],
          ["Phone Number", "phoneNumber"],
          ["Age", "age"],
          ["Password", "password"],
          ["Confirm Password", "confirmPassword"],
        ].map(([label, name]) => (
          <div>
            <div className="label-input" key={name}>
              <label htmlFor={name}>{label}: </label>
              <input
                type={name.includes("password") ? "password" : "text"}
                name={name}
                id={name}
                value={form[name]}
                onChange={handleChange}
              />
              <br />
            </div>
            <br />
          </div>
        ))}

        <div className="buttons">
          <input className="btn" type="submit" value="Register" />
          <Link className="link-btn" to="/">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
