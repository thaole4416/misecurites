const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lenhGiaoDichSchema = new Schema(
  {
    maTaiKhoan: {
      type: String,
      required: true,
      ref: 'TaiKhoan'
    },
    maCoPhieu: { type: String, required: true, ref: 'CoPhieu' },
    loaiLenh: { type: String, required: true },
    khoiLuong: { type: Number, required: true },
    gia: { type: Number, required: true },
    trangThai: { type: String, required: true ,default: 'chờ khớp'},
  },
  { timestamps: true,collection: 'LenhGiaoDich' }
);

lenhGiaoDichSchema.pre("save", function (next, req) {
  var CoPhieu = mongoose.model("CoPhieu"); //--> add this line
  CoPhieu.findOne({ _id: req.body.maCoPhieu }, function (err, found) {
    if (found) return next();
    else return next(new Error("Mã cổ phiếu không tồn tại"));
  });
});
const LenhGiaoDich = mongoose.model("LenhGiaoDich", lenhGiaoDichSchema);

module.exports = LenhGiaoDich;