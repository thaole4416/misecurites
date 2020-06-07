var otpGenerator = require("otp-generator");
const Otp = require("../models/otp.model");
const mailHelper = require("../helpers/mail");

function genOtp(req, res) {
  const otpCode = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const genOtp = new Otp({
    maTaiKhoan: req.userInfo.id,
    email: req.userInfo.email,
    otpCode: otpCode,
    createdTime: Date.now(),
  });
  genOtp.save();
  mailHelper.sendMailOtpCode("ledinhthao131098@gmail.com", otpCode, res);
}

async function verifyOtp(req, res) {
  const otpCodeToVerify = req.body.otpCode;
  const checkTime = Date.now();
  //lay otp in database sort theo createdTime
  const otpObjInDatabase = await Otp.findOne({
    maTaiKhoan: req.userInfo.id,
    email: req.userInfo.email,
  }).sort({ createdTime: -1 });
  //check otp voi otp trong email
  if (otpCodeToVerify == otpObjInDatabase.otpCode) {
    if (checkTime - 60 * 1000 <= otpObjInDatabase.createdTime) {
      res.json({ status: "OK", message: "" });
    } else if (checkTime - 60 * 1000 > otpObjInDatabase.createdTime) {
      res.json({ status: "FAIL", message: "Mã OTP đã hết hạn" });
    }
  } else if (otpCodeToVerify != otpObjInDatabase.otpCode) {
    res.json({ status: "FAIL", message: "Mã OTP không đúng" });
  }
  //giong
  //checkTime nho hon Createdtime < 1 phut => otp
  //checkTime lon hon CreatedTime 1 phut => otp het han
  //khac
  // => otp nhap sai
}

module.exports = {
  genOtp: genOtp,
  verifyOtp: verifyOtp,
};
