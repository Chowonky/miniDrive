import express from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";



dotenv.config();

const Pool = pkg.Pool;

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "100mb" }));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME ,
  password:process.env.DB_PASSWORD ,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  res.send("Hellow World");
});

app.post("/register", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
  const user = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM USERS WHERE phoneNumber=$1`,
      [user.phoneNumber]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid User" });
      return;
    }
    const isValid = await bcrypt.compare(
      user.password,
      result.rows[0].password
    );
    if (!isValid) {
      console.log("wrong password");
      res.status(401).json({ error: "wrong password" });
      return;
    }

    delete result.rows[0].password;
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.log("Error pooling");
    res.status(500).json({ error: error });
  }
});

app.post("/upload", async (req, res) => {
  const file = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO files(phoneNumber,name, size, type, uploaddate,content) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *`,
      [
        file.phoneNumber,
        file.name,
        file.size,
        file.type,
        new Date(),
        file.content,
      ]
    );

    res
      .status(201)
      .json({ file: result.rows[0], message: "file uploaded succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "File upload failed" });
  }
});

app.get("/files/:phoneNumber", async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    const files = await pool.query(
      `
        SELECT * from files where phonenumber=$1 order by uploaddate DESC`,
      [phoneNumber]
    );

    res.json({ files: files.rows });
  } catch (error) {
    console.log("error fetchin files", error);
    res.status(500).json({ error: "error fetching files" });
  }
});

app.delete("/files/:id", async (req, res) => {
  const fileId = req.params.id;

  try {
    await pool.query("DELETE FROM files WHERE id = $1", [fileId]);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.log("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

app.listen(PORT, () => {
  console.log("Server started");
});
