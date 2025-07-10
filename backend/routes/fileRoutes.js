import express from "express";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/fileController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/upload", verifyToken, uploadFile);
router.get("/files/:email", verifyToken, getFiles);
router.delete("/files/:id", verifyToken, deleteFile);

export default router;
