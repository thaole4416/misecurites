const EventEmitter = require("events");
const Util = require("./utils");
const CoPhieu = require("./models/coPhieu.model");
const LenhGiaoDich = require("./models/lenhGiaoDich.model");
const GiaoDichKhop = require("./models/giaoDichKhop.model");
const emitter = new EventEmitter();

emitter.on("MatchOrder", async (type) => {
  const lenhBans = await LenhGiaoDich.find({
    createdDay: Util.getToday(),
    loaiLenh: "bán",
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: 1, createdTime: 1 });

  const lenhMuas = await LenhGiaoDich.find({
    createdDay: Util.getToday(),
    loaiLenh: "mua",
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: -1, createdTime: 1 });

  if (type == "mua") {
    if (!lenhMuas[0]) return;
    let lenhMua = lenhMuas[0];
    for (let lenhBan of lenhBans) {
      if (lenhBan.gia === lenhMua.gia /*&& lenhBan_id != maLenhMua*/) {
        if (lenhMua.khoiLuong > 0) {
          if (lenhMua.khoiLuong >= lenhBan.khoiLuong) {
            _saveGiaoDichKhop(lenhMua, lenhBan, lenhBan.khoiLuong, lenhMua.gia);
            let luongMuaConLai = lenhMua.khoiLuong - lenhBan.khoiLuong;
            lenhMua.khoiLuong = luongMuaConLai;
            _capNhatLaiLenh(lenhMua, lenhBan, luongMuaConLai, 0);
          } else if (lenhMua.khoiLuong < lenhBan.khoiLuong) {
            _saveGiaoDichKhop(lenhMua, lenhBan, lenhBan.khoiLuong, lenhMua.gia);
            let luongBanConLai = lenhBan.khoiLuong - lenhMua.khoiLuong;
            _capNhatLaiLenh(lenhMua, lenhBan, 0, luongBanConLai);
            break;
          }
        } else {
          LenhGiaoDich.findByIdAndUpdate(lenhMua._id, {
            khoiLuong: 0,
            trangThai: "đã khớp",
          }).catch((err) => console.log(err));
          break;
        }
      } else break;
    }
  } else if (type == "bán") {
    if (!lenhBans[0]) return;
    let lenhBan = lenhBans[0];
    for (let lenhMua of lenhMuas) {
      if (lenhMua.gia === lenhBan.gia /*&& lenhMua._id != maLenhBan*/) {
        if (lenhBan.khoiLuong > 0) {
          if (lenhBan.khoiLuong >= lenhMua.khoiLuong) {
            _saveGiaoDichKhop(lenhMua, lenhBan, lenhMua.khoiLuong, lenhBan.gia);
            let luongBanConLai = lenhBan.khoiLuong - lenhMua.khoiLuong;
            lenhBan.khoiLuong = luongBanConLai;
            _capNhatLaiLenh(lenhMua, lenhBan, 0, luongBanConLai);
          } else if (lenhBan.khoiLuong < lenhMua.khoiLuong) {
            _saveGiaoDichKhop(lenhMua, lenhBan, lenhBan.khoiLuong, lenhBan.gia);
            let luongMuaConLai = lenhMua.khoiLuong - lenhBan.khoiLuong;
            _capNhatLaiLenh(lenhMua, lenhBan, luongMuaConLai, 0);
            break;
          }
        } else {
          LenhGiaoDich.findByIdAndUpdate(lenhBan._id, {
            khoiLuong: 0,
            trangThai: "đã khớp",
          }).catch((err) => console.log(err));
          break;
        }
      } else break;
    }
  }
});

let _saveGiaoDichKhop = function (lenhMua, lenhBan, khoiLuong, gia) {
  let giaoDichKhop = new GiaoDichKhop({
    maLenhMua: lenhMua._id,
    maLenhBan: lenhBan._id,
    khoiLuong: khoiLuong,
    gia: gia,
  });
  giaoDichKhop.save().catch((err) => console.log(err));
};

let _capNhatLaiLenh = function (
  lenhMua,
  lenhBan,
  luongMuaConLai,
  luongBanConLai
) {
  let trangThaiMua = luongMuaConLai ? "đang khớp" : "đã khớp";
  let trangThaiBan = luongBanConLai ? "đang khớp" : "đã khớp";
  LenhGiaoDich.findByIdAndUpdate(lenhMua._id, {
    khoiLuong: luongMuaConLai,
    trangThai: trangThaiMua,
  }).catch((err) => console.log(err));
  LenhGiaoDich.findByIdAndUpdate(lenhBan._id, {
    khoiLuong: luongBanConLai,
    trangThai: trangThaiBan,
  }).catch((err) => console.log(err));
};

module.exports = emitter;
