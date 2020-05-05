var EventEmitter2 = require("eventemitter2").EventEmitter2;
var emitter = new EventEmitter2({
  wildcard: true,
  delimiter: "::",
  newListener: false,
  removeListener: true,
  maxListeners: 20,
  verboseMemoryLeak: false,
  ignoreErrors: false,
});

const Util = require("./utils");
const CoPhieu = require("./models/coPhieu.model");
const LenhGiaoDich = require("./models/lenhGiaoDich.model");
const GiaoDichKhop = require("./models/giaoDichKhop.model");

const orderType = Object.freeze({
  buy: "mua",
  sell: "bán",
});

emitter.on("initData", async () => {
  await _initOrder(orderType.buy, 20);
  await _initOrder(orderType.sell, 20);
  emitter.emit("getExchangeData");
});

emitter.on("MatchOrder", async (params) => {
  const [stockId, gia, type] = params;
  const lenhBans = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    gia: gia,
    createdDay: Util.getToday(),
    loaiLenh: orderType.sell,
    khoiLuong: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: 1, createdTime: 1 });
  const lenhMuas = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    gia: gia,
    createdDay: Util.getToday(),
    loaiLenh: orderType.buy,
    khoiLuong: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: -1, createdTime: 1 });
  if (type == orderType.buy) {
    if (!lenhMuas[0]) return;
    let lenhMua = lenhMuas[0];
    for (let lenhBan of lenhBans) {
      // if (lenhBan.gia === lenhMua.gia /*&& lenhBan_id != maLenhMua*/) {
      if (lenhMua.khoiLuong > 0) {
        if (lenhMua.khoiLuong >= lenhBan.khoiLuong) {
          _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhBan.khoiLuong,
            lenhMua.gia
          );
          let luongMuaConLai = lenhMua.khoiLuong - lenhBan.khoiLuong;
          lenhMua.khoiLuong = luongMuaConLai;
          _capNhatLaiLenh(lenhMua, lenhBan, luongMuaConLai, 0);
        } else if (lenhMua.khoiLuong < lenhBan.khoiLuong) {
          _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhBan.khoiLuong,
            lenhMua.gia
          );
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
      // } else break;
    }
  } else if (type == orderType.sell) {
    if (!lenhBans[0]) return;
    let lenhBan = lenhBans[0];
    for (let lenhMua of lenhMuas) {
      // if (lenhMua.gia === lenhBan.gia /*&& lenhMua._id != maLenhBan*/) {
      if (lenhBan.khoiLuong > 0) {
        if (lenhBan.khoiLuong >= lenhMua.khoiLuong) {
          await _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhMua.khoiLuong,
            lenhBan.gia
          );
          let luongBanConLai = lenhBan.khoiLuong - lenhMua.khoiLuong;
          lenhBan.khoiLuong = luongBanConLai;
          await _capNhatLaiLenh(lenhMua, lenhBan, 0, luongBanConLai);
        } else if (lenhBan.khoiLuong < lenhMua.khoiLuong) {
          await _saveGiaoDichKhop(
            stockId,
            lenhMua,
            lenhBan,
            lenhBan.khoiLuong,
            lenhBan.gia
          );
          let luongMuaConLai = lenhMua.khoiLuong - lenhBan.khoiLuong;
          await _capNhatLaiLenh(lenhMua, lenhBan, luongMuaConLai, 0);
          break;
        }
      } else {
        await LenhGiaoDich.findByIdAndUpdate(lenhBan._id, {
          khoiLuong: 0,
          trangThai: "đã khớp",
        }).catch((err) => console.log(err));
        break;
      }
      // } else continue;
    }
  }
});

emitter.on("getExchangeData", async function () {
  let stocksData = await _getStockData();
  // let stocksData = await _returnStocks();
  emitter.emit("returnExchangeData", stocksData);
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
  let trangThaiMua = luongMuaConLai ? "đang khớp" : "đã khớp";
  let trangThaiBan = luongBanConLai ? "đang khớp" : "đã khớp";
  await LenhGiaoDich.findByIdAndUpdate(lenhMua._id, {
    khoiLuong: luongMuaConLai,
    trangThai: trangThaiMua,
  }).catch((err) => console.log(err));
  await LenhGiaoDich.findByIdAndUpdate(lenhBan._id, {
    khoiLuong: luongBanConLai,
    trangThai: trangThaiBan,
  }).catch((err) => console.log(err));
};

let _getStockData = async function () {
  let stocksData = [];
  let coPhieuAll = await CoPhieu.find({ maSan: global.exchange });
  let top3MuaAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: Util.getToday(),
        loaiLenh: orderType.buy,
        maCoPhieu: { $in: global.stocks[global.exchange] },
      },
    },
    {
      $group: {
        _id: {
          gia: "$gia",
          maCoPhieu: "$maCoPhieu",
        },
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
        maCoPhieu: { $in: global.stocks[global.exchange] },
        createdDay: Util.getToday(),
        loaiLenh: orderType.sell,
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
    { $sort: { gia: 1 } },
  ]);

  let top1KhopAll = await GiaoDichKhop.aggregate([
    {
      $match: {
        maCoPhieu: { $in: global.stocks[global.exchange] },
        createdDay: Util.getToday(),
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
    { $sort: { gia: 1 } },
  ]);
  let tongKhopAll = await GiaoDichKhop.aggregate([
    {
      $match: {
        maCoPhieu: { $in: global.stocks[global.exchange] },
        createdDay: Util.getToday(),
      },
    },
    {
      $group: {
        _id: { createdDay: "$createdDay", maCoPhieu: "$maCoPhieu" },
        tongKL: { $sum: "$khoiLuong" },
        tongGT: { $sum: { $multiply: ["$khoiLuong", "$gia"] } },
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

  for (let stockId of global.stocks[global.exchange]) {
    let stockData = {};

    let coPhieu = coPhieuAll.find((x) => x._id === stockId);
    stockData.symbol = coPhieu._id;
    stockData.ceiling = coPhieu.giaTran;
    stockData.floor = coPhieu.giaSan;
    stockData.reference = coPhieu.giaThamChieu;

    let top3Mua = top3MuaAll.filter((x) => x.maCoPhieu == stockId).slice(0, 3);
    stockData.buy_3 = top3Mua[0] ? top3Mua[0].gia : "";
    stockData.buy_2 = top3Mua[1] ? top3Mua[1].gia : "";
    stockData.buy_1 = top3Mua[2] ? top3Mua[2].gia : "";
    stockData.bVol_3 = top3Mua[0] ? top3Mua[0].tongKhoiLuong : "";
    stockData.bVol_2 = top3Mua[1] ? top3Mua[1].tongKhoiLuong : "";
    stockData.bVol_1 = top3Mua[2] ? top3Mua[2].tongKhoiLuong : "";

    let top3Ban = top3BanAll.filter((x) => x.maCoPhieu == stockId).slice(0, 3);
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
    stockData.mVol = top1Khop[0] ? top1Khop[0].tongKhoiLuong : "";

    let tongKhop = tongKhopAll
      .filter((x) => x.maCoPhieu == stockId)
      .slice(0, 1);
    stockData.totalVal = tongKhop[0] ? tongKhop[0].tongGT : "";
    stockData.totalVol = tongKhop[0] ? tongKhop[0].tongKL : "";
    stocksData.push(stockData);
  }
  return stocksData;
};

let _initOrder = async (type, size) => {
  const maTaiKhoan = "1586961656748";
  const stocksList = await CoPhieu.find().select("_id");
  const khoiLuong = [1000, 1500, 2000, 2500, 3000];
  const fakePrices = [19000, 20000, 21000, 21500, 22000];
  let timestamp = Date.now();
  for (let i = 0; i < size; i++) {
    let stockId =
      stocksList[Math.round(Math.random() * (stocksList.length - 1))]._id;
    let gia = fakePrices[Math.round(Math.random() * (fakePrices.length - 1))];
    const coPhieu = new LenhGiaoDich({
      maTaiKhoan: maTaiKhoan,
      maCoPhieu: stockId,
      loaiLenh: type,
      khoiLuong: khoiLuong[Math.round(Math.random() * (khoiLuong.length - 1))],
      gia: gia,
      trangThai: "chờ khớp",
      createdDay: Util.getToday(),
      createdTime: timestamp,
    });
    var next = await coPhieu.save();
    if (next) emitter.emit("MatchOrder", [stockId, gia, type]);
  }
};

module.exports = emitter;
