import express from "express";
import { sendOTP, verifyOTP } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    await sendOTP(email);
    res.status(200).json({ message: "OTP sent succesfully" });
  } catch (error) {
    console.log("Failed to send OTP: ", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const result = verifyOTP(email, otp);
  const user={
    email:email,
    otp:otp,
  }

  if (!result.success) {
    return res.status(401).json({ error: result.message });
  }


  
  res.status(200).json({ user: user ,message: result.message });
});

export default router;
