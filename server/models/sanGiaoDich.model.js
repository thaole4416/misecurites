const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sanGiaoDichSchema = new Schema(
  {
    _id: {type: String}
  }
);

const SanGiaoDich = mongoose.model("SanGiaoDich", sanGiaoDichSchema);

module.exports = SanGiaoDich;
