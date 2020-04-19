const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taiKhoanSchema = new Schema(
  {
    _id: {type: String},
    tenTaiKhoan: {type: String,required: true},
    tenDangNhap: { type: String, required: true },
    matKhau: { type: String, required: true },
    ngaySinh: { type: Date, required: true },
    CMND: { type: Number, required: true },
    ngayCap: { type: Date, required: true },
    noiCap: { type: String, required: true },
    diaChi: { type: String, required: true },
    soDienThoai: { type: Number, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true ,collection: 'TaiKhoan'}
);

const TaiKhoan = mongoose.model("TaiKhoan", taiKhoanSchema);

module.exports = TaiKhoan;
