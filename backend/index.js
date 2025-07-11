import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

dotenv.config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1024mb" }));

app.use(otpRoutes);
app.use(userRoutes);
app.use(fileRoutes);

app.listen(PORT, () => {
  console.log("Server started");
});
