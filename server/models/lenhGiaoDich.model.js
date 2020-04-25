const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lenhGiaoDichSchema = new Schema(
  {
    maTaiKhoan: {
      type: String,
      required: true,
      ref: "TaiKhoan",
    },
    maCoPhieu: { type: String, required: true, ref: "CoPhieu" },
    loaiLenh: { type: String, required: true },
    khoiLuong: { type: Number, required: true },
    gia: { type: Number, required: true },
    trangThai: { type: String, required: true },
    createdDay: { type: String, required: true },
    createdTime: { type: String, required: true },
  },
  { collection: "LenhGiaoDich" }
);

const LenhGiaoDich = mongoose.model("LenhGiaoDich", lenhGiaoDichSchema);

module.exports = LenhGiaoDich;
