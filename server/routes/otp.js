const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const otpStore = {}; // In-memory temporary store

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    otpStore[email] = otp;
    console.log(`OTP for ${email} = ${otp}`);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Verify OTP
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const isValid = otpStore[email] && otpStore[email] === otp;

  if (isValid) {
    delete otpStore[email]; // Remove used OTP
    return res.json({ message: "OTP verified" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
});

module.exports = router;
