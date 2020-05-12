const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const soDuTienSchema = new Schema(
  {
    maTaiKhoan: {type: Schema.Types.ObjectId, ref: 'TaiKhoan'},
    soDu: { type: Number, required: true },
  },
  { timestamps: true,collection: 'SoDuTien' }
);

const SoDuTien = mongoose.model("SoDuTien", soDuTienSchema);

module.exports = SoDuTien;