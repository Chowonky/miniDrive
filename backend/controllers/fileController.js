import pool from "../db/pool.js";
import bcrypt from "bcrypt";

export const uploadFile = async (req, res) => {
  const file = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO files(phonenumber,name, size, type, uploaddate,content,email) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *`,
      [
        file.phoneNumber,
        file.name,
        file.size,
        file.type,
        new Date(),
        file.content,
        file.email,
      ]
    );

    res
      .status(201)
      .json({ file: result.rows[0], message: "file uploaded succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "File upload failed" });
  }
};

export const getFiles = async (req, res) => {
  try {
    const email = req.params.email;

    const files = await pool.query(
      `
        SELECT * from files where email=$1 order by uploaddate DESC`,
      [email]
    );

    res.json({ files: files.rows });
  } catch (error) {
    console.log("error fetchin files", error);
    res.status(500).json({ error: "error fetching files" });
  }
};

export const deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    await pool.query("DELETE FROM files WHERE id = $1", [fileId]);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.log("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
};
