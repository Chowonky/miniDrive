import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";
import { sendOTP, verifyOTP } from "./otpController.js";

export const registerUser = async (req, res) => {
  const user = req.body;
  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const users = await pool.query(
      `SELECT * FROM USERS WHERE email=$1 OR phonenumber=$2`,
      [user.email, user.phoneNumber]
    );
    if (users.rows.length !== 0) {
      res.status(401).json({ error: "User already exists" });
      return;
    }
    const result = await pool.query(
      `INSERT INTO users(fname, lname, age, phoneNumber, password,email) VALUES ($1, $2, $3, $4, $5 ,$6) RETURNING *`,
      [
        user.fname,
        user.lname,
        user.age,
        user.phoneNumber,
        hashedPassword,
        user.email,
      ]
    );

    res
      .status(201)
      .json({ user: result.rows[0], message: "Registered succesfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unknown Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  try {
    const result = await pool.query(`SELECT * FROM USERS WHERE email=$1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid User" });
      return;
    }
    const isValid = await bcrypt.compare(password, result.rows[0].password);
    if (!isValid) {
      console.log("wrong password");
      res.status(401).json({ error: "wrong password" });
      return;
    }

    try {
      const user = result.rows[0];

      try {
        await sendOTP(email);
        console.log("OTP sent succesfully");
      } catch (error) {
        console.log("Could not send otp");
        res.status(500).json({ message: "could not send otp" });
        return;
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      //console.log(token);
      delete result.rows[0].password;
      res.status(200).json({
        user: user,
        token: token,
        message: " otp sent succesfully",
      });
      return;
    } catch (error) {
      res.status(500).json({ message: "could not send otp" });
      return;
    }
  } catch (error) {
    console.log("Error pooling");
    res.status(500).json({ error: error });
  }
};
