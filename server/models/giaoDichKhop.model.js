const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const giaoDichKhopSchema = new Schema(
  {
    maLenhMua: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'LenhGiaoDich'
    },
    maLenhBan: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'LenhGiaoDich'
    },
    KhoiLuong: { type: Number, required: true },
    Gia: { type: Number, required: true },
  },
  { timestamps: true }
);

const GiaoDichKhop = mongoose.model("GiaoDichKhop", giaoDichKhopSchema);

module.exports = GiaoDichKhop;
