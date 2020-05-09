const mongoose = require("mongoose");
const TimeHelper = require('../helpers/time')
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
    maCoPhieu: {
      type: String,
      required: true,
      ref: 'CoPhieu'
    },
    khoiLuong: { type: Number, required: true },
    gia: { type: Number, required: true },
    createdDay: { type: String, default: TimeHelper.getToday()},
    matchedTime : {type: Number, default: Date.now()}
  },
  { collection: 'GiaoDichKhop' }
);

const GiaoDichKhop = mongoose.model("GiaoDichKhop", giaoDichKhopSchema);

module.exports = GiaoDichKhop;
