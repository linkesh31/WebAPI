const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000); // generates number between 0 - 999999
  return otp.toString().padStart(6, '0'); // always returns 6 digit string
};

module.exports = generateOTP;
