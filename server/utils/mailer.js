const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,        //  safer port
  secure: false,    //  TLS 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter 
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter failed to connect:', error);
  } else {
    console.log('✅ Email transporter is ready to send emails');
  }
});

const sendOTP = async (toEmail, otp) => {
  const mailOptions = {
    from: `"AniSport System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OTP Code (AniSport Account)',
    text: `Hello,

Your One-Time Password (OTP) for AniSport is: ${otp}

Please do not share this code with anyone.

Thank you.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return false;
  }
};

module.exports = sendOTP;
