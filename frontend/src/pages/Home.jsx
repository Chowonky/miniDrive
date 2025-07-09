import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="box">
      <h1>miniDrive</h1>
      <br />
      <div className="buttons">
        <Link className="link-btn" to="/login">
          Login
        </Link>
        <Link className="link-btn" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
