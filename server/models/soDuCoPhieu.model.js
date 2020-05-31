const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const soDuCoPhieuSchema = new Schema(
  {
    maTaiKhoan: {
      type: String,
      required: true,
      ref: "TaiKhoan",
    },
    maCoPhieu: { type: String, required: true, ref: "CoPhieu" },
    khoiLuong: { type: Number, required: true },
  },
  { timestamps: true ,collection: 'SoDuCoPhieu'}
);

const SoDuCoPhieu = mongoose.model("SoDuCoPhieu", soDuCoPhieuSchema);

module.exports = SoDuCoPhieu;
