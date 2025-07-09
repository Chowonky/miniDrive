import pkg from "pg";
import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const Pool = pkg.Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default pool;