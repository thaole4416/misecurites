var EventEmitter = require("events");
var emitter = new EventEmitter();
emitter.setMaxListeners(0);
const TimeHelper = require("./helpers/time");
const RandomHelper = require("./helpers/random");
const CoPhieu = require("./models/coPhieu.model");
const TaiKhoan = require("./models/taiKhoan.model");
const LenhGiaoDich = require("./models/lenhGiaoDich.model");
const GiaoDichKhop = require("./models/giaoDichKhop.model");
const GiaHelper = require("./helpers/MatchOrder");
const lenhGiaoDichController = require("./controllers/lenhGiaoDich.controller");
const orderType = Object.freeze({
  buy: "mua",
  sell: "bán",
});
function _initEachSecond(fn) {
  setTimeout(() => {
    fn();
    if (Date.now() < TimeHelper.getTimeSpan([15, 0, 0, 0])) {
      _initEachSecond(fn);
    }
  }, 60000);
}
emitter.on("initData", async () => {
  // _initEachSecond(async function () {
  const tradingSession_HOSE = TimeHelper.getTradingSession("HOSE");
  console.log("Init data phiên", tradingSession_HOSE);
  // const tradingSession_HNX = TimeHelper.getTradingSession("HNX");
  // const tradingSession_UPCOM = TimeHelper.getTradingSession("UPCOM");
  if (tradingSession_HOSE == 1) {
    for (let i = 0; i < 50; i++) {
      if (Math.random()) await _initOrder(orderType.buy + " ATO", 1, "HOSE");
      if (Math.random()) await _initOrder(orderType.sell + " ATO", 1, "HOSE");
      if (Math.random()) await _initOrder(orderType.buy + " LO", 1, "HOSE");
      if (Math.random()) await _initOrder(orderType.sell + " LO", 1, "HOSE");
    }
  } else if (tradingSession_HOSE == 2) {
    await _initOrder(orderType.buy + " ATC", 3, "HOSE");
    await _initOrder(orderType.buy + " ATC", 4, "HOSE");
    await _initOrder(orderType.sell + " LO", 7, "HOSE");
    await _initOrder(orderType.sell + " LO", 9, "HOSE");
  } else if (tradingSession_HOSE == 3) {
    for (let i = 0; i < 50; i++) {
      await _initOrder(orderType.buy + " MP", 1, "HOSE");
      await _initOrder(orderType.buy + " LO", 1, "HOSE");
      await _initOrder(orderType.sell + " MP", 1, "HOSE");
      await _initOrder(orderType.sell + " LO", 1, "HOSE");
    }
  }

  // if (tradingSession_HNX == 2) {
  //   await _initOrder(orderType.buy + " ATC", 7, "HNX");
  //   await _initOrder(orderType.buy + " ATC", 9, "HNX");
  //   await _initOrder(orderType.sell + " LO", 5, "HNX");
  //   await _initOrder(orderType.sell + " LO", 4, "HNX");
  // } else if (tradingSession_HNX == 3) {
  //   await _initOrder(orderType.buy + " MTL", 3, "HNX");
  //   await _initOrder(orderType.buy + " LO", 7, "HNX");
  //   await _initOrder(orderType.sell + " MTL", 1, "HNX");
  //   await _initOrder(orderType.sell + " LO", 9, "HNX");
  // }

  // if (tradingSession_UPCOM == 3) {
  //   await _initOrder(orderType.buy + " MP", 9, "UPCOM");
  //   await _initOrder(orderType.buy + " LO", 8, "UPCOM");
  //   await _initOrder(orderType.sell + " MP", 5, "UPCOM");
  //   await _initOrder(orderType.sell + " LO", 4, "UPCOM");
  // }
  // });
});
emitter.on("MatchOrder_LO", async (params) => {
  const [stockId, gia, type] = params;
  const lenhBans = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    loaiLenh: orderType.sell + " LO",
    gia: { $lte: gia },
    createdDay: TimeHelper.getToday(),
    khoiLuongConLai: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: 1, createdTime: 1, khoiLuong: 1 });
  const lenhMuas = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    loaiLenh: orderType.buy + " LO",
    gia: { $gte: gia },
    createdDay: TimeHelper.getToday(),
    khoiLuongConLai: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: -1, createdTime: 1, khoiLuong: 1 });
  if (type.split(" ")[0] == orderType.buy) {
    if (!lenhMuas[0]) return;
    let lenhMua = lenhMuas[0];
    for (let lenhBan of lenhBans) {
      // if (lenhBan.gia === lenhMua.gia /*&& lenhBan_id != maLenhMua*/) {
      if (lenhMua.khoiLuongConLai > 0) {
        if (lenhMua.khoiLuongConLai >= lenhBan.khoiLuongConLai) {
          let min = Math.min(lenhMua.gia, lenhBan.gia);
          _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhBan.khoiLuongConLai,
            min
          );
          let luongMuaConLai =
            lenhMua.khoiLuongConLai - lenhBan.khoiLuongConLai;
          lenhMua.khoiLuong = luongMuaConLai;
          _capNhatLaiLenh(lenhMua, lenhBan, luongMuaConLai, 0);
        } else if (lenhMua.khoiLuongConLai < lenhBan.khoiLuongConLai) {
          let min = Math.min(lenhMua.gia, lenhBan.gia);
          _saveGiaoDichKhop(stockId, lenhMua, lenhBan, lenhBan.khoiLuong, min);
          let luongBanConLai =
            lenhBan.khoiLuongConLai - lenhMua.khoiLuongConLai;
          _capNhatLaiLenh(lenhMua, lenhBan, 0, luongBanConLai);
          break;
        }
      } else {
        LenhGiaoDich.findByIdAndUpdate(lenhMua._id, {
          khoiLuongConLai: 0,
          trangThai: "đã khớp",
        }).catch((err) => console.log(err));
        break;
      }
      // } else break;
    }
  } else if (type.split(" ")[0] == orderType.sell) {
    if (!lenhBans[0]) return;
    let lenhBan = lenhBans[0];
    for (let lenhMua of lenhMuas) {
      if (lenhBan.khoiLuongConLai > 0) {
        if (lenhBan.khoiLuongConLai >= lenhMua.khoiLuongConLai) {
          await _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhMua.khoiLuongConLai,
            lenhBan.gia
          );
          let luongBanConLai =
            lenhBan.khoiLuongConLai - lenhMua.khoiLuongConLai;
          lenhBan.khoiLuong = luongBanConLai;
          await _capNhatLaiLenh(lenhMua, lenhBan, 0, luongBanConLai);
        } else if (lenhBan.khoiLuongConLai < lenhMua.khoiLuongConLai) {
          await _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhBan.khoiLuongConLai,
            lenhBan.gia
          );
          let luongMuaConLai =
            lenhMua.khoiLuongConLai - lenhBan.khoiLuongConLai;
          await _capNhatLaiLenh(lenhMua, lenhBan, luongMuaConLai, 0);
          break;
        }
      } else {
        await LenhGiaoDich.findByIdAndUpdate(lenhBan._id, {
          khoiLuongConLai: 0,
          trangThai: "đã khớp",
        }).catch((err) => console.log(err));
        break;
      }
    }
  }
  emitter.emit("getExchangeDataOne", stockId);
});

emitter.on("MatchOrder_MPX", async (param) => {
  const { lenhGiaoDich, res } = param;
  if (lenhGiaoDich.loaiLenh.split(" ")[0] === "mua") {
    let lenhBans = await LenhGiaoDich.find({
      loaiLenh: "bán LO",
      maCoPhieu: lenhGiaoDich.maCoPhieu,
      trangThai: { $nin: ["đã hủy, khớp hoàn toàn"] },
      khoiLuongConLai: { $ne: 0 },
      createdDay: TimeHelper.getToday(),
    }).sort({ gia: 1, createdTime: -1, khoiLuong: -1 });
    if (lenhBans.length === 0) {
      await LenhGiaoDich.updateOne(
        { _id: lenhGiaoDich._id },
        { trangThai: "đã hủy" }
      );
      if (res) {
        emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
        res.json({
          status: "OK",
          message: "Lệnh bị hủy do không thấy đối ứng",
        });
      }
    }
    let khoiluongConLai = lenhGiaoDich.khoiLuongConLai;
    let dataKhop = [];
    let idLenhBans = [];
    let giaBan = 0;
    for (let lenhBan of lenhBans) {
      if (lenhBan.khoiLuongConLai == 0) continue;
      let khoiLuongKhop = Math.min(
        lenhGiaoDich.khoiLuongConLai,
        lenhBan.khoiLuongConLai
      );
      if (lenhGiaoDich.khoiLuongConLai >= lenhBan.khoiLuongConLai) {
        dataKhop.push({
          maLenhMua: lenhGiaoDich._id,
          maLenhBan: lenhBan._id,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          khoiLuong: khoiLuongKhop,
          gia: lenhBan.gia,
          createdDay: TimeHelper.getToday(),
          matchedTime: Date.now(),
        });
        khoiluongConLai = khoiluongConLai - khoiLuongKhop;
        lenhGiaoDich.khoiLuongConLai = khoiluongConLai;
        lenhBan.khoiLuongConLai = 0;
        giaBan = lenhBan.gia;
        idLenhBans.push(lenhBan._id);
      } else if (lenhGiaoDich.khoiLuongConLai < lenhBan.khoiLuongConLai) {
        dataKhop.push({
          maLenhMua: lenhGiaoDich._id,
          maLenhBan: lenhBan._id,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          khoiLuong: khoiLuongKhop,
          gia: lenhBan.gia,
          createdDay: TimeHelper.getToday(),
          matchedTime: Date.now(),
        });
        lenhBan.khoiLuongConLai = lenhBan.khoiLuongConLai - khoiLuongKhop;
        lenhGiaoDich.khoiLuongConLai = 0;
        idLenhBans.push(lenhBan._id);
        break;
      }
    }
    if (
      lenhGiaoDich.khoiLuongConLai > 0 &&
      lenhGiaoDich.khoiLuongConLai < lenhGiaoDich.khoiLuong
    ) {
      if (lenhGiaoDich.loaiLenh.split(" ")[1] === "MOK") {
        await LenhGiaoDich.updateOne(
          { _id: lenhGiaoDich._id },
          { trangThai: "đã hủy", khoiLuongConLai: lenhGiaoDich.khoiLuong }
        );
        emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
        if (res) {
          return res.json({
            status: "OK",
            message: "Lệnh bị hủy do không được thực hiện toàn bộ",
          });
        }
      }
      for (let idLenhBan of idLenhBans) {
        let lenhBan = lenhBans.find((x) => x._id == idLenhBan);
        await _saveGiaoDichKhop(
          lenhGiaoDich.maCoPhieu,
          lenhGiaoDich._id,
          idLenhBan,
          lenhBan.khoiLuong - lenhBan.khoiLuongConLai,
          lenhBan.gia
        );
        await LenhGiaoDich.updateOne(
          { _id: idLenhBan },
          {
            khoiLuongConLai: lenhBan.khoiLuongConLai,
            trangThai: "khớp toàn bộ",
          }
        );
      }
      await LenhGiaoDich.updateOne(
        { _id: lenhGiaoDich._id },
        {
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          trangThai: "khớp một phần",
        }
      );
      if (lenhGiaoDich.loaiLenh.split(" ")[1] === "MP") {
        lenhGiaoDich.loaiLenh = "mua LO";
        lenhGiaoDich.createdTime = Date.now();
        if (giaBan * 1 < 10000) {
          lenhGiaoDich.gia = `${giaBan * 1 + 10}`;
        } else if (giaBan * 1 >= 50000) {
          lenhGiaoDich.gia = `${giaBan * 1 + 100}`;
        } else {
          lenhGiaoDich.gia = `${giaBan * 1 + 50}`;
        }
        await LenhGiaoDich.create({
          maTaiKhoan: lenhGiaoDich.maTaiKhoan,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          loaiLenh: "mua LO",
          khoiLuong: lenhGiaoDich.khoiLuongConLai,
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          gia: lenhGiaoDich.gia,
          trangThai: "đã xác nhận",
          createdDay: TimeHelper.getToday(),
          createdTime: Date.now(),
          preId: lenhGiaoDich._id,
        });
      } else if (lenhGiaoDich.loaiLenh.split(" ")[1] === "MTL") {
        lenhGiaoDich.loaiLenh = "mua LO";
        lenhGiaoDich.createdTime = Date.now();
        await LenhGiaoDich.create({
          maTaiKhoan: lenhGiaoDich.maTaiKhoan,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          loaiLenh: "mua LO",
          khoiLuong: lenhGiaoDich.khoiLuongConLai,
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          gia: lenhGiaoDich.gia * 1 + 100,
          trangThai: "đã xác nhận",
          createdDay: TimeHelper.getToday(),
          createdTime: Date.now(),
          preId: lenhGiaoDich._id,
        });
      }
      emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
      if (res) {
        return res.json({ status: "OK", message: "Them thanh cong lenh!" });
      }
    } else {
      for (let idLenhBan of idLenhBans) {
        let lenhBan = lenhBans.find((x) => x._id == idLenhBan);
        await _saveGiaoDichKhop(
          lenhGiaoDich.maCoPhieu,
          lenhGiaoDich._id,
          idLenhBan,
          lenhBan.khoiLuong - lenhBan.khoiLuongConLai,
          lenhBan.gia
        );
        await LenhGiaoDich.updateOne(
          { _id: idLenhBan },
          {
            khoiLuongConLai: lenhBan.khoiLuongConLai,
            trangThai:
              lenhBan.khoiLuongConLai == 0 ? "khớp toàn bộ" : "đã xác nhận",
          }
        );
      }
      await LenhGiaoDich.updateOne(
        { _id: lenhGiaoDich._id },
        {
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          trangThai: "khớp toàn bộ",
        }
      );
      emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
      if (res) {
        return res.json({ status: "OK", message: "Them thanh cong lenh!" });
      }
    }
  } else if (lenhGiaoDich.loaiLenh.split(" ")[0] === "bán") {
    let lenhMuas = await LenhGiaoDich.find({
      loaiLenh: "mua LO",
      maCoPhieu: lenhGiaoDich.maCoPhieu,
      trangThai: { $nin: ["đã hủy", "khớp hoàn toàn"] },
      khoiLuongConLai: { $ne: 0 },
      createdDay: TimeHelper.getToday(),
    }).sort({ gia: -1, createdTime: -1, khoiLuong: -1 });
    if (lenhMuas.length === 0) {
      await LenhGiaoDich.updateOne(
        { _id: lenhGiaoDich._id },
        { trangThai: "đã hủy" }
      );
      emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
      if (res) {
        return res.json({
          status: "OK",
          message: "Lệnh bị hủy do không thấy đối ứng",
        });
      }
    }
    let khoiluongConLai = lenhGiaoDich.khoiLuongConLai;
    let dataKhop = [];
    let idlenhMuas = [];
    let giaMua = 0;
    for (let lenhMua of lenhMuas) {
      if (lenhMua.khoiLuongConLai == 0) continue;
      let khoiLuongKhop = Math.min(
        lenhGiaoDich.khoiLuongConLai,
        lenhMua.khoiLuongConLai
      );
      if (lenhGiaoDich.khoiLuongConLai >= lenhMua.khoiLuongConLai) {
        dataKhop.push({
          maLenhMua: lenhMua._id,
          maLenhBan: lenhGiaoDich._id,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          khoiLuong: khoiLuongKhop,
          gia: lenhMua.gia,
          createdDay: TimeHelper.getToday(),
          matchedTime: Date.now(),
        });
        khoiluongConLai = khoiluongConLai - khoiLuongKhop;
        lenhGiaoDich.khoiLuongConLai = khoiluongConLai;
        lenhMua.khoiLuongConLai = 0;
        giaMua = lenhMua.gia;
        idlenhMuas.push(lenhMua._id);
      } else if (lenhGiaoDich.khoiLuongConLai < lenhMua.khoiLuongConLai) {
        dataKhop.push({
          maLenhMua: lenhMua._id,
          maLenhBan: lenhGiaoDich._id,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          khoiLuong: khoiLuongKhop,
          gia: lenhMua.gia,
          createdDay: TimeHelper.getToday(),
          matchedTime: Date.now(),
        });
        lenhMua.khoiLuongConLai = lenhMua.khoiLuongConLai - khoiLuongKhop;
        lenhGiaoDich.khoiLuongConLai = 0;
        idlenhMuas.push(lenhMua._id);
        break;
      }
    }
    if (
      lenhGiaoDich.khoiLuongConLai > 0 &&
      lenhGiaoDich.khoiLuongConLai < lenhGiaoDich.khoiLuong
    ) {
      if (lenhGiaoDich.loaiLenh.split(" ")[1] === "MOK") {
        await LenhGiaoDich.updateOne(
          { _id: lenhGiaoDich._id },
          { trangThai: "đã hủy", khoiLuongConLai: lenhGiaoDich.khoiLuong }
        );
        emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
        if (res) {
          res.json({
            status: "OK",
            message: "Lệnh bị hủy do không được thực hiện toàn bộ",
          });
        }
      }
      for (let idlenhMua of idlenhMuas) {
        let lenhMua = lenhMuas.find((x) => x._id == idlenhMua);
        await _saveGiaoDichKhop(
          lenhGiaoDich.maCoPhieu,
          idlenhMua,
          lenhGiaoDich._id,
          lenhMua.khoiLuong - lenhMua.khoiLuongConLai,
          lenhMua.gia
        );
        await LenhGiaoDich.updateOne(
          { _id: idlenhMua },
          {
            khoiLuongConLai: lenhMua.khoiLuongConLai,
            trangThai: "khớp toàn bộ",
          }
        );
      }
      await LenhGiaoDich.updateOne(
        { _id: lenhGiaoDich._id },
        {
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          trangThai: "khớp một phần",
        }
      );
      if (lenhGiaoDich.loaiLenh.split(" ")[1] === "MP") {
        lenhGiaoDich.loaiLenh = "bán LO";
        lenhGiaoDich.createdTime = Date.now();
        if (giaMua * 1 < 10000) {
          lenhGiaoDich.gia = `${giaMua * 1 - 10}`;
        } else if (giaMua * 1 >= 50000) {
          lenhGiaoDich.gia = `${giaMua * 1 - 100}`;
        } else {
          lenhGiaoDich.gia = `${giaMua * 1 - 50}`;
        }
        await LenhGiaoDich.create({
          maTaiKhoan: lenhGiaoDich.maTaiKhoan,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          loaiLenh: "bán LO",
          khoiLuong: lenhGiaoDich.khoiLuongConLai,
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          gia: lenhGiaoDich.gia,
          trangThai: "đã xác nhận",
          createdDay: TimeHelper.getToday(),
          createdTime: Date.now(),
          preId: lenhGiaoDich._id,
        });
      } else if (lenhGiaoDich.loaiLenh.split(" ")[1] === "MTL") {
        lenhGiaoDich.loaiLenh = "bán LO";
        lenhGiaoDich.createdTime = Date.now();
        await LenhGiaoDich.create({
          maTaiKhoan: lenhGiaoDich.maTaiKhoan,
          maCoPhieu: lenhGiaoDich.maCoPhieu,
          loaiLenh: "bán LO",
          khoiLuong: lenhGiaoDich.khoiLuongConLai,
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          gia: lenhGiaoDich.gia * 1 - 100,
          trangThai: "đã xác nhận",
          createdDay: TimeHelper.getToday(),
          createdTime: Date.now(),
          preId: lenhGiaoDich._id,
        });
      }
      if (res) {
        emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
        return res.json({ status: "OK", message: "Them thanh cong lenh!" });
      }
    } else {
      for (let idlenhMua of idlenhMuas) {
        let lenhMua = lenhMuas.find((x) => x._id == idlenhMua);
        await _saveGiaoDichKhop(
          lenhGiaoDich.maCoPhieu,
          idlenhMua,
          lenhGiaoDich._id,
          lenhMua.khoiLuong - lenhMua.khoiLuongConLai,
          lenhMua.gia
        );
        await LenhGiaoDich.updateOne(
          { _id: idlenhMua },
          {
            khoiLuongConLai: lenhMua.khoiLuongConLai,
            trangThai:
              lenhMua.khoiLuongConLai == 0 ? "khớp toàn bộ" : "đã xác nhận",
          }
        );
      }
      await LenhGiaoDich.updateOne(
        { _id: lenhGiaoDich._id },
        {
          khoiLuongConLai: lenhGiaoDich.khoiLuongConLai,
          trangThai: "khớp toàn bộ",
        }
      );
      emitter.emit("getExchangeDataOne", lenhGiaoDich.maCoPhieu);
      if (res) {
        return res.json({ status: "OK", message: "Them thanh cong lenh!" });
      }
    }
  }
});

emitter.on("getExchangeData", async function () {
  let stocksData_HOSE = await _getStockData("HOSE");
  // let stocksData = [...stocksData_HOSE, ...stocksData_HNX, ...stocksData_UPCOM];
  emitter.emit("returnExchangeData", stocksData_HOSE);
});
let _saveGiaoDichKhop = async function (
  maCoPhieu,
  lenhMua,
  lenhBan,
  khoiLuong,
  gia
) {
  let giaoDichKhop = new GiaoDichKhop({
    maCoPhieu: maCoPhieu,
    maLenhMua: lenhMua._id,
    maLenhBan: lenhBan._id,
    khoiLuong: khoiLuong,
    gia: gia,
  });
  await giaoDichKhop.save();
};
let _capNhatLaiLenh = async function (
  lenhMua,
  lenhBan,
  luongMuaConLai,
  luongBanConLai
) {
  let trangThaiMua = luongMuaConLai == 0 ? "khớp toàn bộ" : "đã xác nhận";
  let trangThaiBan = luongBanConLai == 0 ? "khớp toàn bộ" : "đã xác nhận";
  await LenhGiaoDich.findByIdAndUpdate(lenhMua._id, {
    khoiLuongConLai: luongMuaConLai,
    trangThai: trangThaiMua,
  }).catch((err) => console.log(err));
  await LenhGiaoDich.findByIdAndUpdate(lenhBan._id, {
    khoiLuongConLai: luongBanConLai,
    trangThai: trangThaiBan,
  }).catch((err) => console.log(err));
};
let _getStockData = async function (exchange) {
  // get stockdata phiên định kỳ
  if (
    TimeHelper.getTradingSession(exchange) == 1 ||
    TimeHelper.getTradingSession(exchange) == 2
  ) {
    let stocksData = [];
    let coPhieuAll = await CoPhieu.find({ maSan: exchange });
    let muaATxAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
          loaiLenh: { $in: ["mua ATC", "mua ATO"] },
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: {
            gia: "$gia",
            maCoPhieu: "$maCoPhieu",
          },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          maCoPhieu: "$_id.maCoPhieu",
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
    ]);
    let banATxAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
          loaiLenh: { $in: ["bán ATC", "bán ATO"] },
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: { gia: "$gia", maCoPhieu: "$maCoPhieu" },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          maCoPhieu: "$_id.maCoPhieu",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: 1 } },
    ]);
    let top3MuaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
          loaiLenh: orderType.buy + " LO",
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: {
            gia: "$gia",
            maCoPhieu: "$maCoPhieu",
          },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          maCoPhieu: "$_id.maCoPhieu",
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: -1 } },
    ]);
    let top3BanAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
          loaiLenh: orderType.sell + " LO",
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: { gia: "$gia", maCoPhieu: "$maCoPhieu" },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          maCoPhieu: "$_id.maCoPhieu",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: 1 } },
    ]);
    let top1KhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
        },
      },
      {
        $group: {
          _id: { gia: "$gia", maCoPhieu: "$maCoPhieu" },
          tongKhoiLuong: { $sum: "$khoiLuong" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          maCoPhieu: "$_id.maCoPhieu",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { matchedTime: 1 } },
    ]);
    let tongKhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
        },
      },
      {
        $group: {
          _id: { createdDay: "$createdDay", maCoPhieu: "$maCoPhieu" },
          tongKL: { $sum: "$khoiLuong" },
          tongGT: {
            $sum: {
              $multiply: ["$khoiLuong", { $toDouble: "$gia" }],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          maCoPhieu: "$_id.maCoPhieu",
          tongKL: 1,
          tongGT: 1,
        },
      },
      { $match: { tongKL: { $ne: 0 }, tongGT: { $ne: 0 } } },
    ]);
    for (let coPhieu of coPhieuAll) {
      let stockData = {};
      let stockId = coPhieu._id;
      stockData.symbol = coPhieu._id;
      stockData.ceiling = coPhieu.giaTran;
      stockData.floor = coPhieu.giaSan;
      stockData.reference = coPhieu.giaThamChieu;
      stockData.exchange = coPhieu.maSan;

      let muaATx = muaATxAll.find((x) => x.maCoPhieu == stockId);
      stockData.buy_3 = muaATx ? muaATx.gia : "";
      stockData.bVol_3 = muaATx ? muaATx.tongKhoiLuong : "";

      let top3Mua = top3MuaAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 3);

      if (!stockData.buy_3) {
        stockData.buy_3 = top3Mua[0] ? top3Mua[0].gia : "";
        stockData.buy_2 = top3Mua[1] ? top3Mua[1].gia : "";
        stockData.buy_1 = top3Mua[2] ? top3Mua[2].gia : "";
      } else {
        stockData.buy_2 = top3Mua[0] ? top3Mua[0].gia : "";
        stockData.buy_1 = top3Mua[1] ? top3Mua[1].gia : "";
      }

      if (!stockData.bVol_3) {
        stockData.bVol_3 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
        stockData.bVol_2 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
        stockData.bVol_1 = top3Mua[2] ? top3Mua[2].tongKhoiLuong : "";
      } else {
        stockData.bVol_2 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
        stockData.bVol_1 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
      }

      let banATx = banATxAll.find((x) => x.maCoPhieu == stockId);
      stockData.sell_1 = banATx ? banATx.gia : "";
      stockData.sVol_1 = banATx ? banATx.tongKhoiLuong : "";
      let top3Ban = top3BanAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 3);

      if (!stockData.sell_1) {
        stockData.sell_1 = top3Ban[0] ? top3Ban[0].gia : "";
        stockData.sell_2 = top3Ban[1] ? top3Ban[1].gia : "";
        stockData.sell_3 = top3Ban[2] ? top3Ban[2].gia : "";
      } else {
        stockData.sell_2 = top3Ban[0] ? top3Ban[0].gia : "";
        stockData.sell_3 = top3Ban[1] ? top3Ban[1].gia : "";
      }

      if (!stockData.sVol_1) {
        stockData.sVol_1 = top3Ban[0] ? top3Ban[0].tongKhoiLuong : "";
        stockData.sVol_2 = top3Ban[1] ? top3Ban[1].tongKhoiLuong : "";
        stockData.sVol_3 = top3Ban[2] ? top3Ban[2].tongKhoiLuong : "";
      } else {
        stockData.sVol_2 = top3Ban[0] ? top3Ban[0].tongKhoiLuong : "";
        stockData.sVol_3 = top3Ban[1] ? top3Ban[1].tongKhoiLuong : "";
      }
      let top1Khop = top1KhopAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 1);
      let dsGiaKhop = await GiaHelper.dsGiaKhop(
        exchange,
        TimeHelper.getTradingSession(exchange) == 1
      );
      stockData.match = dsGiaKhop[stockId] ? dsGiaKhop[stockId] : "";
      stockData.mVol = "";

      let tongKhop = tongKhopAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 1);
      stockData.totalVal = tongKhop[0] ? tongKhop[0].tongGT : "";
      stockData.totalVol = tongKhop[0] ? tongKhop[0].tongKL : "";
      stocksData.push(stockData);
    }
    return stocksData;
  }
  // get stocks Data phiên liên tục
  else if (TimeHelper.getTradingSession(exchange) == 3) {
    let stocksData = [];
    let coPhieuAll = await CoPhieu.find({ maSan: exchange });
    let top3MuaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
          loaiLenh: "mua LO",
        },
      },
      {
        $group: {
          _id: {
            gia: "$gia",
            maCoPhieu: "$maCoPhieu",
          },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          maCoPhieu: "$_id.maCoPhieu",
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: -1 } },
    ]);
    let top3BanAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
          loaiLenh: orderType.sell + " LO",
        },
      },
      {
        $group: {
          _id: { gia: "$gia", maCoPhieu: "$maCoPhieu" },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          maCoPhieu: "$_id.maCoPhieu",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: 1 } },
    ]);
    let top1KhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: { $in: coPhieuAll.map((x) => x._id) },
        },
      },
      { $sort: { matchedTime: -1 } },
    ]);
    let tongKhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
        },
      },
      {
        $group: {
          _id: { createdDay: "$createdDay", maCoPhieu: "$maCoPhieu" },
          tongKL: { $sum: "$khoiLuong" },
          tongGT: {
            $sum: { $multiply: ["$khoiLuong", { $toDouble: "$gia" }] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          maCoPhieu: "$_id.maCoPhieu",
          tongKL: 1,
          tongGT: 1,
        },
      },
      { $match: { tongKL: { $ne: 0 }, tongGT: { $ne: 0 } } },
    ]);

    for (let coPhieu of coPhieuAll) {
      let stockData = {};
      let stockId = coPhieu._id;
      stockData.symbol = coPhieu._id;
      stockData.ceiling = coPhieu.giaTran;
      stockData.floor = coPhieu.giaSan;
      stockData.reference = coPhieu.giaThamChieu;
      stockData.exchange = coPhieu.maSan;
      let top3Mua = top3MuaAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 3);
      stockData.buy_3 = top3Mua[0] ? top3Mua[0].gia : "";
      stockData.buy_2 = top3Mua[1] ? top3Mua[1].gia : "";
      stockData.buy_1 = top3Mua[2] ? top3Mua[2].gia : "";
      stockData.bVol_3 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
      stockData.bVol_2 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
      stockData.bVol_1 = top3Mua[2] ? top3Mua[2].tongKhoiLuong : "";

      let top3Ban = top3BanAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 3);
      stockData.sell_1 = top3Ban[0] ? top3Ban[0].gia : "";
      stockData.sell_2 = top3Ban[1] ? top3Ban[1].gia : "";
      stockData.sell_3 = top3Ban[2] ? top3Ban[2].gia : "";
      stockData.sVol_1 = top3Ban[0] ? top3Ban[0].tongKhoiLuong : "";
      stockData.sVol_2 = top3Ban[1] ? top3Ban[1].tongKhoiLuong : "";
      stockData.sVol_3 = top3Ban[2] ? top3Ban[2].tongKhoiLuong : "";

      let top1Khop = top1KhopAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 1);
      stockData.match = top1Khop[0] ? top1Khop[0].gia : "";
      stockData.mVol = top1Khop[0] ? top1Khop[0].khoiLuong : "";

      let tongKhop = tongKhopAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 1);
      stockData.totalVal = tongKhop[0] ? tongKhop[0].tongGT : "";
      stockData.totalVol = tongKhop[0] ? tongKhop[0].tongKL : "";
      stocksData.push(stockData);
    }
    return stocksData;
  } else {
    let stocksData = [];
    let coPhieuAll = await CoPhieu.find({ maSan: exchange });
    for (let coPhieu of coPhieuAll) {
      let stockData = {};
      let stockId = coPhieu._id;
      stockData.symbol = coPhieu._id;
      stockData.ceiling = coPhieu.giaTran;
      stockData.floor = coPhieu.giaSan;
      stockData.reference = coPhieu.giaThamChieu;
      stockData.exchange = coPhieu.maSan;
      stocksData.push(stockData);
    }
    return stocksData;
  }
};
let _initOrder = async (type, size, exchange) => {
  const maTaiKhoan = ["29A000001", "29A000002", "29A000003"];

  let SAM = await LenhGiaoDich.find({
    maCoPhieu: "SAM",
    createdDay: TimeHelper.getToday(),
  });

  if (!SAM.length && global.phien == 1) {
    const maCoPhieu = "SAM";
    let timestamp = Date.now();
    let data = [
      {
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
        maTaiKhoan: "29A000003",
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
  }
  const stocksList = await CoPhieu.find({
    maSan: exchange,
    maCoPhieu: { $ne: "SAM" },
  });
  const khoiLuong = [1000, 1500, 2000, 2500, 3000];
  let timestamp = Date.now();
  let stockPosition = Math.round(Math.random() * (stocksList.length - 1));
  let stockId = stocksList[stockPosition]._id;
  let gia = 0;
  while (gia < 1000) {
    gia = RandomHelper.random(
      stocksList.find((x) => x._id === stockId).giaSan,
      stocksList.find((x) => x._id === stockId).giaTran
    );
  }
  let khoiLuongRnd =
    khoiLuong[Math.round(Math.random() * (khoiLuong.length - 1))];
  let maTaiKhoanRnd =
    maTaiKhoan[Math.round(Math.random() * (maTaiKhoan.length - 1))];
  if (type.split(" ")[1] == "ATO") gia = "ATO";
  else if (type.split(" ")[1] == "ATC") gia = "ATC";
  if(stockId == "SAM") stockId = "GAS";
  const lenhGiaoDich = new LenhGiaoDich({
    maTaiKhoan: maTaiKhoanRnd,
    maCoPhieu: stockId,
    loaiLenh: type,
    khoiLuong: khoiLuongRnd,
    khoiLuongConLai: khoiLuongRnd,
    gia: gia,
    trangThai: "đã xác nhận",
    createdDay: TimeHelper.getToday(),
    createdTime: timestamp,
  });
  try {
    let result = await lenhGiaoDich.save();
    //neu la phien lien tuc thi moi match order
    const tradingSession = TimeHelper.getTradingSession(exchange);
    if (tradingSession == 1 || tradingSession == 2) {
      emitter.emit("getExchangeDataOne", stockId);
    } else if (tradingSession == 3) {
      if (type.split(" ")[1] == "LO") {
        emitter.emit("MatchOrder_LO", [stockId, gia, type]);
      } else
        emitter.emit("MatchOrder_MPX", {
          lenhGiaoDich: result,
        });
    }
  } catch (error) {
    console.log(error);
  }
};

emitter.on("getExchangeDataOne", async function (symbol) {
  let stockData = await _getStockDataOne(symbol);
  emitter.emit("returnExchangeDataOne", stockData);
});

let _getStockDataOne = async function (symbol) {
  // get stockdata phiên định kỳ
  let coPhieu = await CoPhieu.findOne({ _id: symbol });
  let exchange = coPhieu.maSan;
  if (
    TimeHelper.getTradingSession(exchange) == 1 ||
    TimeHelper.getTradingSession(exchange) == 2
  ) {
    let stockData = {};
    let muaATx = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
          loaiLenh: { $in: ["mua ATC", "mua ATO"] },
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: {
            gia: "$gia",
          },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
    ]);
    let banATx = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
          loaiLenh: { $in: ["bán ATC", "bán ATO"] },
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: { gia: "$gia" },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: 1 } },
    ]);
    let top3MuaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
          loaiLenh: orderType.buy + " LO",
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: {
            gia: "$gia",
          },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: -1 } },
    ]);
    let top3BanAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
          loaiLenh: orderType.sell + " LO",
          trangThai: "đã xác nhận",
        },
      },
      {
        $group: {
          _id: { gia: "$gia" },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: 1 } },
    ]);
    let tongKhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
        },
      },
      {
        $group: {
          _id: { createdDay: "$createdDay" },
          tongKL: { $sum: "$khoiLuong" },
          tongGT: {
            $sum: { $multiply: ["$khoiLuong", { $toDouble: "$gia" }] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          tongKL: 1,
          tongGT: 1,
        },
      },
      { $match: { tongKL: { $ne: 0 }, tongGT: { $ne: 0 } } },
    ]);
    stockData.symbol = coPhieu._id;
    stockData.ceiling = coPhieu.giaTran;
    stockData.floor = coPhieu.giaSan;
    stockData.reference = coPhieu.giaThamChieu;
    stockData.exchange = coPhieu.maSan;
    stockData.buy_3 = muaATx[0] ? muaATx[0].gia : "";
    stockData.bVol_3 = muaATx[0] ? muaATx[0].tongKhoiLuong : "";
    let top3Mua = top3MuaAll.slice(0, 3);

    if (!stockData.buy_3) {
      stockData.buy_3 = top3Mua[0] ? top3Mua[0].gia : "";
      stockData.buy_2 = top3Mua[1] ? top3Mua[1].gia : "";
      stockData.buy_1 = top3Mua[2] ? top3Mua[2].gia : "";
    } else {
      stockData.buy_2 = top3Mua[0] ? top3Mua[0].gia : "";
      stockData.buy_1 = top3Mua[1] ? top3Mua[1].gia : "";
    }

    if (!stockData.bVol_3) {
      stockData.bVol_3 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
      stockData.bVol_2 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
      stockData.bVol_1 = top3Mua[2] ? top3Mua[2].tongKhoiLuong : "";
    } else {
      stockData.bVol_2 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
      stockData.bVol_1 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
    }

    stockData.sell_1 = banATx[0] ? banATx[0].gia : "";
    stockData.sVol_1 = banATx[0] ? banATx[0].tongKhoiLuong : "";
    let top3Ban = top3BanAll.slice(0, 3);

    if (!stockData.sell_1) {
      stockData.sell_1 = top3Ban[0] ? top3Ban[0].gia : "";
      stockData.sell_2 = top3Ban[1] ? top3Ban[1].gia : "";
      stockData.sell_3 = top3Ban[2] ? top3Ban[2].gia : "";
    } else {
      stockData.sell_2 = top3Ban[0] ? top3Ban[0].gia : "";
      stockData.sell_3 = top3Ban[1] ? top3Ban[1].gia : "";
    }

    if (!stockData.sVol_1) {
      stockData.sVol_1 = top3Ban[0] ? top3Ban[0].tongKhoiLuong : "";
      stockData.sVol_2 = top3Ban[1] ? top3Ban[1].tongKhoiLuong : "";
      stockData.sVol_3 = top3Ban[2] ? top3Ban[2].tongKhoiLuong : "";
    } else {
      stockData.sVol_2 = top3Ban[0] ? top3Ban[0].tongKhoiLuong : "";
      stockData.sVol_3 = top3Ban[1] ? top3Ban[1].tongKhoiLuong : "";
    }
    let dsGiaKhop = await GiaHelper.dsGiaKhop(
      exchange,
      TimeHelper.getTradingSession(exchange) == 1
    );
    stockData.match = dsGiaKhop[symbol] ? dsGiaKhop[symbol] : "";
    stockData.mVol = "";
    let tongKhop = tongKhopAll
      .filter((x) => x.maCoPhieu == stockId)
      .slice(0, 1);
    stockData.totalVal = tongKhop[0] ? tongKhop[0].tongGT : "";
    stockData.totalVol = tongKhop[0] ? tongKhop[0].tongKL : "";
    return stockData;
  }
  // get stocks Data phiên liên tục
  else if (TimeHelper.getTradingSession(exchange) == 3) {
    let top3MuaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
          loaiLenh: "mua LO",
        },
      },
      {
        $group: {
          _id: {
            gia: "$gia",
          },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: -1 } },
    ]);
    let top3BanAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
          loaiLenh: orderType.sell + " LO",
        },
      },
      {
        $group: {
          _id: { gia: "$gia" },
          tongKhoiLuong: { $sum: "$khoiLuongConLai" },
        },
      },
      {
        $match: {
          tongKhoiLuong: { $ne: 0 },
        },
      },
      {
        $project: {
          _id: 0,
          gia: "$_id.gia",
          tongKhoiLuong: 1,
        },
      },
      { $sort: { gia: 1 } },
    ]);
    let top1KhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
        },
      },
      { $sort: { matchedTime: -1 } },
    ]);
    let tongKhopAll = await GiaoDichKhop.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          maCoPhieu: symbol,
        },
      },
      {
        $group: {
          _id: { createdDay: "$createdDay" },
          tongKL: { $sum: "$khoiLuong" },
          tongGT: {
            $sum: {
              $multiply: ["$khoiLuong", { $toDouble: "$gia" }],
            },
          },
        },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     tongKL: 1,
      //     tongGT: 1,
      //   },
      // },
      // { $match: { tongKL: { $ne: 0 }, tongGT: { $ne: 0 } } },
    ]);
    let stockData = {};
    let stockId = coPhieu._id;
    stockData.symbol = coPhieu._id;
    stockData.ceiling = coPhieu.giaTran;
    stockData.floor = coPhieu.giaSan;
    stockData.reference = coPhieu.giaThamChieu;
    stockData.exchange = coPhieu.maSan;
    let top3Mua = top3MuaAll.slice(0, 3);
    stockData.buy_3 = top3Mua[0] ? top3Mua[0].gia : "";
    stockData.buy_2 = top3Mua[1] ? top3Mua[1].gia : "";
    stockData.buy_1 = top3Mua[2] ? top3Mua[2].gia : "";
    stockData.bVol_3 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
    stockData.bVol_2 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
    stockData.bVol_1 = top3Mua[2] ? top3Mua[2].tongKhoiLuong : "";

    let top3Ban = top3BanAll.slice(0, 3);
    stockData.sell_1 = top3Ban[0] ? top3Ban[0].gia : "";
    stockData.sell_2 = top3Ban[1] ? top3Ban[1].gia : "";
    stockData.sell_3 = top3Ban[2] ? top3Ban[2].gia : "";
    stockData.sVol_1 = top3Ban[0] ? top3Ban[0].tongKhoiLuong : "";
    stockData.sVol_2 = top3Ban[1] ? top3Ban[1].tongKhoiLuong : "";
    stockData.sVol_3 = top3Ban[2] ? top3Ban[2].tongKhoiLuong : "";

    let top1Khop = top1KhopAll
      .filter((x) => x.maCoPhieu == stockId)
      .slice(0, 1);
    stockData.match = top1Khop[0] ? top1Khop[0].gia : "";
    stockData.mVol = top1Khop[0] ? top1Khop[0].khoiLuong : "";

    let tongKhop = tongKhopAll;
    stockData.totalVal = tongKhop[0] ? tongKhop[0].tongGT : "";
    stockData.totalVol = tongKhop[0] ? tongKhop[0].tongKL : "";
    return stockData;
  } else {
    let stockData = {};
    stockData.symbol = coPhieu._id;
    stockData.ceiling = coPhieu.giaTran;
    stockData.floor = coPhieu.giaSan;
    stockData.reference = coPhieu.giaThamChieu;
    stockData.exchange = coPhieu.maSan;
    return stockData;
  }
};
module.exports = emitter;
