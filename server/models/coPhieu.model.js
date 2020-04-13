const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coPhieuSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    maSan: { type: String, required: true ,ref: 'SanGiaoDich'},
    giaTran: { type: Number, required: true },
    giaSan: { type: Number, required: true },
    giaThamChieu: { type: Number, required: true },
  },
  { timestamps: true }
);

const CoPhieu = mongoose.model("CoPhieu", coPhieuSchema);

module.exports = CoPhieu;
