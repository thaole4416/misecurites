const TimeHelper = require("../helpers/time");
let CoPhieu = require("../models/coPhieu.model");
let LenhGiaoDich = require("../models/lenhGiaoDich.model");
const emitter = require("../emitter");

let create = async (req, res) => {
  //NOTE: thiếu mã cổ phiếu ở đây;
  const maCoPhieu = req.body.maCoPhieu;
  const checkMaCoPhieu = await CoPhieu.findById(maCoPhieu);
  if (!checkMaCoPhieu) {
    return res.json({ status: "FAIL", message: "Mã cổ phiếu không tồn tại" });
  }
  const loaiLenh = req.body.loaiLenh;
  const khoiLuong = req.body.khoiLuong;
  const gia = req.body.gia;
  let timestamp = Date.now();
  const coPhieu = new LenhGiaoDich({
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: loaiLenh,
    khoiLuong: khoiLuong,
    khoiLuongConLai: khoiLuong,
    gia: gia,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  });
  coPhieu
    .save(req)
    .then(() => {
      //neu la phien lien tuc thi moi match order
      const tradingSession = TimeHelper.getTradingSession(req.body.maSan);
      if (/* tradingSession == 1 || tradingSession == 2 */ process.env.DINHKY) {
        emitter.emit("getExchangeData", {
          exchange: req.body.maSan,
          socketId: null,
        });
      } else if (/* tradingSession == 3 */ process.env.LIENTUC) {
        if (loaiLenh.split(" ")[1] == "LO")
          emitter.emit("MatchOrder_LO", [
            maCoPhieu,
            gia,
            loaiLenh,
            req.body.maSan,
          ]);
        else
          emitter.emit("MatchOrder_MP", [
            maCoPhieu,
            gia,
            loaiLenh,
            req.body.maSan,
          ]);
      }
      //neu khong thi chi gi thoi
      return res.json({ status: "OK", message: "Them thanh cong lenh!" });
    })
    .catch((err) => res.json({ status: "FAIL", message: err.toString() }));
};

let getAll = (req, res) => {
  LenhGiaoDich.find({ createdDay: TimeHelper.getToday() })
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
};
let testRegex = (req, res) => {
  LenhGiaoDich.find({
    createdDay: TimeHelper.getToday(),
    loaiLenh: { $regex: /bán*/g },
  })
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
};

let clearAll = (req, res) => {
  LenhGiaoDich.deleteMany()
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
};

let test = async (req, res) => {
  const maCoPhieu = "FPT";
  let timestamp = Date.now();
  let data = [{
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua ATO",
    khoiLuong: 1500,
    khoiLuongConLai: 1500,
    gia: "ATO",
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua ATO",
    khoiLuong: 1200,
    khoiLuongConLai: 1200,
    gia: "ATO",
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua ATO",
    khoiLuong: 1300,
    khoiLuongConLai: 1300,
    gia: "ATO",
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán ATO",
    khoiLuong: 2000,
    khoiLuongConLai: 2000,
    gia: "ATO",
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán ATO",
    khoiLuong: 3000,
    khoiLuongConLai: 3000,
    gia: "ATO",
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    khoiLuong: 5200,
    khoiLuongConLai: 5200,
    gia: 38000,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    khoiLuong: 8300,
    khoiLuongConLai: 8300,
    gia: 37700,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    khoiLuong: 15000,
    khoiLuongConLai: 15000,
    gia: 37400,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    gia: 37100,
    khoiLuong: 18500,
    khoiLuongConLai: 18500,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    khoiLuong: 13400,
    khoiLuongConLai: 13400,
    gia: 36800,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    khoiLuongConLai: 5600,
    khoiLuong: 5600,
    gia: 36500,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "bán LO",
    khoiLuong: 4000,
    khoiLuongConLai: 4000,
    gia: 36200,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua LO",
    khoiLuong: 8000,
    khoiLuongConLai: 8000,
    gia: 38000,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua LO",
    khoiLuong: 18000,
    khoiLuongConLai: 18000,
    gia: 37700,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua LO",
    khoiLuong: 15000,
    khoiLuongConLai: 15000,
    gia: 37400,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua LO",
    khoiLuong: 5000,
    khoiLuongConLai: 5000,
    gia: 36800,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua LO",
    khoiLuong: 4500,
    khoiLuongConLai: 4500,
    gia: 36500,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: maCoPhieu,
    loaiLenh: "mua LO",
    khoiLuong: 3500,
    khoiLuongConLai: 3500,
    gia: 36200,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: "MBB",
    loaiLenh: "mua LO",
    khoiLuong: 45000,
    khoiLuongConLai: 45000,
    gia: 42000,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
  {
    maTaiKhoan: req.userInfo.id,
    maCoPhieu: "MBB",
    loaiLenh: "bán LO",
    khoiLuong: 46000,
    khoiLuongConLai: 46000,
    gia: 42000,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  },
]
  await LenhGiaoDich.collection.insertMany(data);
  res.json("Thành công")
};

module.exports = {
  create: create,
  getAll: getAll,
  clearAll: clearAll,
  testRegex: testRegex,
  test: test
};
