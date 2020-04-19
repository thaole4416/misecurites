const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taiSanCoPhieuSchema = new Schema(
  {
    maTaiKhoan: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TaiKhoan",
    },
    maCoPhieu: { type: String, required: true, ref: "CoPhieu" },
    khoiLuong: { type: Number, required: true },
  },
  { timestamps: true ,collection: 'TaiSanCoPhieu'}
);

const TaiSanCoPhieu = mongoose.model("TaiSanCoPhieu", taiSanCoPhieuSchema);

module.exports = TaiSanCoPhieu;
