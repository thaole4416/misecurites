const TimeHelper = require("../helpers/time");
let CoPhieu = require("../models/coPhieu.model");
let LenhGiaoDich = require("../models/lenhGiaoDich.model");
const emitter = require("../emitter");

let create = async (req, res) => {
  //NOTE: thiếu mã cổ phiếu ở đây;
  const maCoPhieu = req.body.maCoPhieu;
  const checkMaCoPhieu = await CoPhieu.findById(maCoPhieu);
  if (!checkMaCoPhieu) {
    return res.json({ Error: "Mã cổ phiếu không tồn tại" });
  }
  const loaiLenh = req.body.loaiLenh;
  const khoiLuong = req.body.khoiLuong;
  const gia = req.body.gia;
  let timestamp = Date.now();
  const coPhieu = new LenhGiaoDich({
    maTaiKhoan: maTaiKhoan,
    maCoPhieu: maCoPhieu,
    loaiLenh: loaiLenh,
    khoiLuong: khoiLuong,
    gia: gia,
    trangThai: "chờ khớp",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  });
  coPhieu
    .save(req)
    .then(() => {
      emitter.emit("MatchOrder", [maCoPhieu, gia, loaiLenh]);
      if (global.stocks[global.exchange].includes(maCoPhieu))
        emitter.emit("getExchangeData");
      return res.json("Them thanh cong lenh!");
    })
    .catch((err) => res.json({ Error: err.toString() }));
};

let getAll = (req, res) => {
  LenhGiaoDich.find({ createdDay: TimeHelper.getToday() })
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
};

let clearAll = (req, res) => {
  LenhGiaoDich.deleteMany()
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
};

module.exports = {
  create: create,
  getAll: getAll,
  clearAll: clearAll,
};
