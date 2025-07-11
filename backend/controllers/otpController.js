import nodemailer from "nodemailer";

const otpStore = {};

export async function sendOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp: otp,
    expiresAt: Date.now() + 1 * 60 * 1000,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "Your miniDrive OTP",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}

export function verifyOTP(email, inputOTP) {
  const record = otpStore[email];
  if (!record) return { success: false, message: "No OTP sent" };
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return { success: false, message: "OTP expired" };
  }
  if (record.otp !== inputOTP) {
    return { success: false, message: "Incorrect OTP" };
  }

  delete otpStore[email];
  return { success: true, message: "OTP verified" };
}
