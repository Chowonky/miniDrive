import express from "express";
import {
  uploadFile,
  getFiles,
  deleteFile
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", uploadFile);
router.get("/files/:phoneNumber", getFiles);
router.delete("/files/:id", deleteFile);

export default router;
