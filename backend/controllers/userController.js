import jwt from "jsonwebtoken";
import pool from "../db/pool.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const user = req.body;
  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users(fname, lname, age, phoneNumber, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.fname, user.lname, user.age, user.phoneNumber, hashedPassword]
    );

    res
      .status(201)
      .json({ user: result.rows[0], message: "Registered succesfully" });
  } catch (error) {
    console.log("User already exists");
    res.status(401).json({ error: "User already exists" });
  }
};

export const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM USERS WHERE phoneNumber=$1`,
      [phoneNumber]
    );
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

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phonenumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    delete result.rows[0].password;
    res.json({ user: user, token: token });
  } catch (error) {
    console.log("Error pooling");
    res.status(500).json({ error: error });
  }
};
