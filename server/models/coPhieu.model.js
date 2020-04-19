const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coPhieuSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    maSan: { type: String, required: true, ref: "SanGiaoDich" },
    giaTran: { type: Number, required: true },
    giaSan: { type: Number, required: true },
    giaThamChieu: { type: Number, required: true },
  },
  { timestamps: true ,collection: 'CoPhieu'}
);

coPhieuSchema.pre("save", function (next, req) {
  var SanGiaoDich = mongoose.model("SanGiaoDich"); //--> add this line
  SanGiaoDich.findOne({ _id: req.body.maSan }, function (err, found) {
    if (found) return next();
    else return next(new Error("Mã sàn không tồn tại"));
  });
});

const CoPhieu = mongoose.model("CoPhieu", coPhieuSchema);

module.exports = CoPhieu;
