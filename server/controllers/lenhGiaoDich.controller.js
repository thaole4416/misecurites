const TimeHelper = require("../helpers/time");
let CoPhieu = require("../models/coPhieu.model");
let SoDuTien = require("../models/soDuTien.model");
let SoDuCoPhieu = require("../models/soDuCoPhieu.model");
let GiaoDichKhop = require("../models/giaoDichKhop.model");
let LenhGiaoDich = require("../models/lenhGiaoDich.model");
const emitter = require("../emitter");
const request = require("request");
async function create(req, res) {
  let captchaResponse = req.body.captcha;
  if (captchaResponse) {
    request(
      {
        url: "https://www.google.com/recaptcha/api/siteverify",
        method: "POST",
        form: {
          secret: "6LcLKwEVAAAAAA0Q-hISl0Y7mXKPkujiEvslL0a5",
          response: captchaResponse,
        },
      },
      async function (error, response, body) {
        // Parse String thành JSON object
        try {
          body = JSON.parse(body);
        } catch (err) {
          body = {};
        }

        if (!error && response.statusCode == 200 && body.success) {
          // Captcha hợp lệ, xử lý tiếp phần đăng ký tài khoản
          //NOTE: thiếu mã cổ phiếu ở đây;
          const maCoPhieu = req.body.maCoPhieu;
          if (
            ![
              ...global.stocks["HOSE"],
              ...global.stocks["HNX"],
              ...global.stocks["UPCOM"],
            ].includes(maCoPhieu)
          ) {
            return res.json({
              status: "FAIL",
              message: "Mã cổ phiếu không tồn tại",
            });
          }
          const loaiLenh = req.body.loaiLenh;
          if (
            ![
              "mua LO",
              "mua MP",
              "mua MOK",
              "mua MTL",
              "mua MAK",
              "mua ATC",
              "mua ATO",
              "bán LO",
              "bán MP",
              "bán MOK",
              "bán MTL",
              "bán MAK",
              "bán ATC",
              "bán ATO",
            ].includes(loaiLenh)
          ) {
            return res.json({
              status: "FAIL",
              message: "loại lệnh không hợp lệ",
            });
          }
          const khoiLuong = req.body.khoiLuong;
          const gia = req.body.gia;
          let timestamp = Date.now();
          const lenhGiaoDich = new LenhGiaoDich({
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
          try {
            let result = await lenhGiaoDich.save(req);
            //neu la phien lien tuc thi moi match order
            const tradingSession = TimeHelper.getTradingSession(req.body.maSan);
            if (tradingSession == 1 || tradingSession == 2) {
              emitter.emit("getExchangeDataOne", maCoPhieu);
              return res.json({
                status: "OK",
                message: "Them thanh cong lenh!",
              });
            } else if (tradingSession == 3) {
              if (loaiLenh.split(" ")[1] == "LO") {
                if (loaiLenh.split(" ")[0] == "mua") {
                  let soDu = await SoDuTien.findOne({
                    maTaiKhoan: req.userInfo.id,
                  });
                  await soDu.updateOne({
                    soDu: soDu.soDu - khoiLuong * (gia * 1),
                  });
                } else if (loaiLenh.split(" ")[0] == "bán") {
                  let soDu = await SoDuCoPhieu.findOne({
                    maTaiKhoan: req.userInfo.id,
                    maCoPhieu: maCoPhieu,
                  });
                  await soDu.updateOne({
                    khoiLuong: soDu.khoiLuong - khoiLuong,
                  });
                }
                emitter.emit("MatchOrder_LO", [maCoPhieu, gia, loaiLenh]);
                return res.json({
                  status: "OK",
                  message: "Them thanh cong lenh!",
                });
              } else
                emitter.emit("MatchOrder_MPX", {
                  lenhGiaoDich: result,
                  res: res,
                });
            }
          } catch (error) {
            res.json({ status: "FAIL", message: error.toString() });
          }
        } else {
          res.json({ status: "FAIL", message: "Captcha không hợp lệ" });
        }
      }
    );
  } else {
    // Xử lý lỗi nếu không có Captcha
    res.json({ status: "FAIL", message: "Không có catpcha" });
  }
}
function getAll(req, res) {
  LenhGiaoDich.find({ createdDay: TimeHelper.getToday() })
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
}
function testRegex(req, res) {
  LenhGiaoDich.find({
    createdDay: TimeHelper.getToday(),
    loaiLenh: { $regex: /bán*/g },
  })
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
}
function clearAll(req, res) {
  LenhGiaoDich.deleteMany()
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
}
async function test(req, res) {
  const maCoPhieu = "SAM";
  let timestamp = Date.now();
  let data = [
    {
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
      loaiLenh: "bán LO",
      khoiLuong: 46000,
      khoiLuongConLai: 46000,
      gia: 42000,
      trangThai: "đã xác nhận",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    },
  ];
  await LenhGiaoDich.collection.insertMany(data);
  emitter.emit("getExchangeDataOne", maCoPhieu);
  emitter.emit("getExchangeDataOne", "MBB");
  if(res)res.json("Thành công");
}
async function test2(req, res) {
  const maCoPhieu = "FPT";
  let timestamp = Date.now();
  let data = [
    {
      maTaiKhoan: req.userInfo.id,
      maCoPhieu: maCoPhieu,
      loaiLenh: "mua ATC",
      khoiLuong: 1500,
      khoiLuongConLai: 1500,
      gia: "ATC",
      trangThai: "đã xác nhận",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    },
    {
      maTaiKhoan: req.userInfo.id,
      maCoPhieu: maCoPhieu,
      loaiLenh: "mua ATC",
      khoiLuong: 1200,
      khoiLuongConLai: 1200,
      gia: "ATC",
      trangThai: "đã xác nhận",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    },
    {
      maTaiKhoan: req.userInfo.id,
      maCoPhieu: maCoPhieu,
      loaiLenh: "mua ATC",
      khoiLuong: 1300,
      khoiLuongConLai: 1300,
      gia: "ATC",
      trangThai: "đã xác nhận",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    },
    {
      maTaiKhoan: req.userInfo.id,
      maCoPhieu: maCoPhieu,
      loaiLenh: "bán ATC",
      khoiLuong: 2000,
      khoiLuongConLai: 2000,
      gia: "ATC",
      trangThai: "đã xác nhận",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    },
    {
      maTaiKhoan: req.userInfo.id,
      maCoPhieu: maCoPhieu,
      loaiLenh: "bán ATC",
      khoiLuong: 3000,
      khoiLuongConLai: 3000,
      gia: "ATC",
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
      maCoPhieu: "",
      loaiLenh: "bán LO",
      khoiLuong: 46000,
      khoiLuongConLai: 46000,
      gia: 42000,
      trangThai: "đã xác nhận",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    },
  ];
  await LenhGiaoDich.collection.insertMany(data);
  emitter.emit("getExchangeData");
  res.json("Thành công");
}
function testRegex(req, res) {
  LenhGiaoDich.find({
    createdDay: TimeHelper.getToday(),
    loaiLenh: { $regex: /bán*/g },
  })
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
}
async function history(req, res) {
  try {
    let history = await LenhGiaoDich.find({
      maTaiKhoan: req.userInfo.id,
      createdDay: TimeHelper.getToday(),
    });
    res.json({ status: "OK", message: history, data: history });
  } catch (err) {
    res.json({ status: "FAIL", message: err });
  }
}
async function edit(req, res) {
  const khoiLuongSua = req.body.khoiLuongSua;
  const giaSua = req.body.giaSua;
  const khoiLuongConLai = req.body.khoiLuongConLai;
  const gia = req.body.gia;
  const maCoPhieu = req.body.maCoPhieu;
  const maLenh = req.body.maLenh;

  const lenhGiaoDich = LenhGiaoDich.findOne({
    _id: maLenh,
    maTaiKhoan: req.userInfo.id,
  });
  if (lenhGiaoDich) {
    // const tradingSession = TimeHelper.getTradingSession();
    const tradingSession = 1;
    if (tradingSession == 1 || tradingSession == 2) {
      res.json({
        status: "FAIL",
        message: "Không thể sửa lệnh trong phiên định kỳ",
      });
    } else if (tradingSession == 3) {
      if (khoiLuongSua > khoiLuongConLai || giaSua > gia) {
        res.json({ status: "OK", message: "Sửa thành công" });
      } else if (khoiLuongSua < khoiLuongConLai) {
        res.json({ status: "OK", message: "Sửa thành công" });
      }
    }
  } else
    res.json({
      status: "FAIL",
      message: "Lệnh không tồn tại",
    });
}
async function cancel(req, res) {
  const maCoPhieu = req.body.maCoPhieu;
  const maLenh = req.body.maLenh;
  const lenhGiaoDich = LenhGiaoDich.findOne({
    _id: maLenh,
    maTaiKhoan: req.userInfo.id,
  });
  if (lenhGiaoDich) {
    // const tradingSession = TimeHelper.getTradingSession();
    const tradingSession = 1;
    if (tradingSession == 1 || tradingSession == 2) {
      res.json({
        status: "FAIL",
        message: "Không thể hủy lệnh trong phiên định kỳ",
      });
    } else if (tradingSession == 3) {
      res.json({ status: "OK", message: "Hủy thành công" });
    }
  } else
    res.json({
      status: "FAIL",
      message: "Lệnh không tồn tại",
    });
}
function phien(req, res) {
  return res.json(global.phien);
}
async function setPhien(req, res) {
  global.phien = req.body.phien;
  await LenhGiaoDich.deleteMany();
  await GiaoDichKhop.deleteMany();
  emitter.emit("getExchangeData");
  return res.json({ status: "OK" });
}
function init(req, res) {
  emitter.emit("initData");
  return res.json({ status: "OK" });
}
function end(req, res) {
  return res.json({ status: "OK" });
}

module.exports = {
  create: create,
  getAll: getAll,
  clearAll: clearAll,
  testRegex: testRegex,
  test: test,
  test2: test2,
  history: history,
  edit: edit,
  cancel: cancel,
  phien: phien,
  setPhien: setPhien,
  init: init,
  end: end,
};
