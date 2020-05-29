var EventEmitter = require("events");
var emitter = new EventEmitter();

const TimeHelper = require("./helpers/time");
const RandomHelper = require("./helpers/random");
const CoPhieu = require("./models/coPhieu.model");
const TaiKhoan = require("./models/taiKhoan.model");
const LenhGiaoDich = require("./models/lenhGiaoDich.model");
const GiaoDichKhop = require("./models/giaoDichKhop.model");

const orderType = Object.freeze({
  buy: "mua",
  sell: "bán",
});

emitter.on("initData", () => {
  let time = { hour: 20, minute: 46, second: 0, milisecond: 0 };
  TimeHelper.excuteCodeAtTime(async function () {
    for (let i = 0; i < 200; i++) {
      await _initOrder(orderType.buy + " LO", 1);
      await _initOrder(orderType.sell + " LO", 1);
    }
    emitter.emit("getExchangeData", { exchange: "HOSE", socketId: null });
    emitter.emit("getExchangeData", { exchange: "HNX", socketId: null });
    emitter.emit("getExchangeData", { exchange: "UPCOM", socketId: null });
  }, time);
});

emitter.on("MatchOrder_LO", async (params) => {
  const [stockId, gia, type, exchange] = params;
  console.log("Here ", stockId, gia, type, exchange);
  const lenhBans = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    gia: { $lte: gia },
    createdDay: TimeHelper.getToday(),
    loaiLenh: orderType.sell + " LO",
    khoiLuong: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: 1, createdTime: 1 });
  const lenhMuas = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    gia: { $gte: gia },
    createdDay: TimeHelper.getToday(),
    loaiLenh: orderType.buy + " LO",
    khoiLuong: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: -1, createdTime: 1 });
  if (type.split(" ")[0] == orderType.buy) {
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
  } else if (type.split(" ")[0] == orderType.sell) {
    if (!lenhBans[0]) return;
    let lenhBan = lenhBans[0];
    for (let lenhMua of lenhMuas) {
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
    }
  }

  if (global.stocks[exchange].includes(stockId)) console.log("here");
  emitter.emit("getExchangeData", { exchange: exchange, socketId: null });
});

emitter.on("MatchOrder_MP", async (params) => {
  const [stockId, gia, type, exchange] = params;
  const lenhBans = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    gia: { $lte: gia },
    createdDay: TimeHelper.getToday(),
    loaiLenh: orderType.sell + " LO",
    khoiLuong: { $ne: 0 },
    trangThai: { $ne: "đã khớp" },
  }).sort({ gia: 1, createdTime: 1 });
  const lenhMuas = await LenhGiaoDich.find({
    maCoPhieu: stockId,
    gia: { $gte: gia },
    createdDay: TimeHelper.getToday(),
    loaiLenh: orderType.buy + " LO",
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
    }
  }

  if (global.stocks[exchange].includes(stockId))
    emitter.emit("getExchangeData", { exchange: exchange, socketId: null });
});

emitter.on("getExchangeData", async function (param) {
  const { exchange, socketId } = param;
  let stocksData = await _getStockData(exchange);
  // let stocksData = await _returnStocks();
  emitter.emit("returnExchangeData", {
    stocksData: stocksData,
    socketId: socketId,
  });
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

let _getStockData = async function (exchange) {
  // get stockdata phiên định kỳ
  if (1 == 1) {
    let stocksData = [];
    let coPhieuAll = await CoPhieu.find({ maSan: exchange });
    let muaATxAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          loaiLenh: { $in: ["mua ATC", "mua ATO"] },
          maCoPhieu: { $in: global.stocks[exchange] },
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
    ]);
    let banATxAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          maCoPhieu: { $in: global.stocks[exchange] },
          createdDay: TimeHelper.getToday(),
          loaiLenh: { $in: ["bán ATC", "bán ATO"] },
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
    let top3MuaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          loaiLenh: orderType.buy + " LO",
          maCoPhieu: { $in: global.stocks[exchange] },
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
          maCoPhieu: { $in: global.stocks[exchange] },
          createdDay: TimeHelper.getToday(),
          loaiLenh: orderType.sell + " LO",
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
    let tongKhopAll = [];
    let top1KhopAll = [];
    for (let coPhieu of coPhieuAll) {
      let stockData = {};
      let stockId = coPhieu._id;
      stockData.symbol = coPhieu._id;
      stockData.ceiling = coPhieu.giaTran;
      stockData.floor = coPhieu.giaSan;
      stockData.reference = coPhieu.giaThamChieu;

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
  }
  // get stocks Data phiên liên tục
  else if (1 != 1) {
    let stocksData = [];
    let coPhieuAll = await CoPhieu.find({ maSan: exchange });
    let top3MuaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          loaiLenh: orderType.buy + " LO",
          maCoPhieu: { $in: global.stocks[exchange] },
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
          maCoPhieu: { $in: global.stocks[exchange] },
          createdDay: TimeHelper.getToday(),
          loaiLenh: orderType.sell + " LO",
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
          maCoPhieu: { $in: global.stocks[exchange] },
          createdDay: TimeHelper.getToday(),
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
          maCoPhieu: { $in: global.stocks[exchange] },
          createdDay: TimeHelper.getToday(),
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

    for (let coPhieu of coPhieuAll) {
      let stockData = {};
      let stockId = coPhieu._id;
      stockData.symbol = coPhieu._id;
      stockData.ceiling = coPhieu.giaTran;
      stockData.floor = coPhieu.giaSan;
      stockData.reference = coPhieu.giaThamChieu;

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
      stockData.mVol = top1Khop[0] ? top1Khop[0].tongKhoiLuong : "";

      let tongKhop = tongKhopAll
        .filter((x) => x.maCoPhieu == stockId)
        .slice(0, 1);
      stockData.totalVal = tongKhop[0] ? tongKhop[0].tongGT : "";
      stockData.totalVol = tongKhop[0] ? tongKhop[0].tongKL : "";
      stocksData.push(stockData);
    }
    return stocksData;
  }
};

let _initOrder = async (type, size) => {
  const taiKhoan = await TaiKhoan.findOne({ tenDangNhap: "Creator" });
  const maTaiKhoan = taiKhoan._id;
  const stocksList = await CoPhieu.find();
  const khoiLuong = [1000, 1500, 2000, 2500, 3000];
  let timestamp = Date.now();
  for (let i = 0; i < size; i++) {
    let stockPosition = Math.round(Math.random() * (stocksList.length - 1));
    let stockId = stocksList[stockPosition]._id;
    let gia = RandomHelper.random(
      stocksList[stockPosition].giaTran,
      stocksList[stockPosition].giaSan
    );
    const coPhieu = new LenhGiaoDich({
      maTaiKhoan: maTaiKhoan,
      maCoPhieu: stockId,
      loaiLenh: type,
      khoiLuong: khoiLuong[Math.round(Math.random() * (khoiLuong.length - 1))],
      gia: gia,
      trangThai: "chờ khớp",
      createdDay: TimeHelper.getToday(),
      createdTime: timestamp,
    });
    var next = await coPhieu.save();
    if (next) emitter.emit("MatchOrder", [stockId, gia, type]);
  }
};

module.exports = emitter;
