const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {

    maTaiKhoan: { type: String, required: true, ref: "TaiKhoan" },
    email: { type: String, required: true },
    otpCode: { type: String, required: true },
    createdTime: { type: String, required: true },
  },
  { timestamps: false ,collection: 'Otp'}
);


const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;




