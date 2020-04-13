const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taiSanTienSchema = new Schema(
  {
    maTaiKhoan: {type: Schema.Types.ObjectId, ref: 'TaiKhoan'},
    soDu: { type: Number, required: true },
  },
  { timestamps: true }
);

const TaiSanTien = mongoose.model("TaiSanTien", taiSanTienSchema);

module.exports = TaiSanTien;
