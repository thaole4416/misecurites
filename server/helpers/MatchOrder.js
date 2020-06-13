const LenhGiaoDich = require("../models/lenhGiaoDich.model");
const CoPhieu = require("../models/coPhieu.model");
const GiaoDichKhop = require("../models/giaoDichKhop.model");
const TimeHelper = require("./time");
const emitter = require("../emitter");

async function KhopPhienDinhKy(req, res) {
  //check ATO
  try {
    if (1 != 1) {
      await _doIt("HOSE", true);
      emitter.emit("getExchangeData");
      try {
        res.json({
          mes: "Khớp định kỳ ATO",
        });
      } catch (err) {
        res.json(err);
      }
    } else if (1 == 1) {
      await _doIt("HOSE");
      await _doIt("HNX");
      emitter.emit("getExchangeData");
      try {
        res.json({
          mes: "Khớp định kỳ ATC",
        });
      } catch (err) {
        res.json(err);
      }
    }
  } catch (error) {}
}

async function dsGiaKhop(exchange, isATO = false) {
  let coPhieus = await CoPhieu.find({ maSan: exchange });
  let type = isATO ? "ATO" : "ATC";
  let muaATXAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: TimeHelper.getToday(),
        loaiLenh: `mua ${type}`,
        maCoPhieu: { $in: global.stocks[exchange] },
        trangThai: "đã xác nhận",
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
  let banATXAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        maCoPhieu: { $in: global.stocks[exchange] },
        createdDay: TimeHelper.getToday(),
        loaiLenh: `bán ${type}`,
        trangThai: "đã xác nhận",
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
  let muaAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: TimeHelper.getToday(),
        loaiLenh: "mua LO",
        maCoPhieu: { $in: global.stocks[exchange] },
        trangThai: "đã xác nhận",
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
  let banAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        maCoPhieu: { $in: global.stocks[exchange] },
        createdDay: TimeHelper.getToday(),
        loaiLenh: "bán LO",
        trangThai: "đã xác nhận",
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
  let giaAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: TimeHelper.getToday(),
        maCoPhieu: { $in: global.stocks[exchange] },
        loaiLenh: { $ne: { $in: [`mua ${type}`, `bán ${type}`] } },
        gia: { $ne: `${type}` },
        trangThai: "đã xác nhận",
      },
    },
    {
      $group: {
        _id: "$maCoPhieu",
        gia: { $addToSet: "$gia" },
      },
    },
  ]);
  let dsGiaKhop = {};
  for (let dataRow of giaAll) {
    let dsGia = dataRow.gia.sort();
    let dsMua = muaAll.filter((x) => x.maCoPhieu == dataRow._id);
    let dsBan = banAll.filter((x) => x.maCoPhieu == dataRow._id);
    let muaATX = muaATXAll.find((x) => x.maCoPhieu == dataRow._id);
    let banATX = banATXAll.find((x) => x.maCoPhieu == dataRow._id);
    let giaThamChieu = coPhieus.find((x) => x._id == dataRow._id).giaThamChieu;
    if (dsMua.length == 0 || dsBan.length == 0) {
      dsGiaKhop[dataRow._id] = 0;
      continue;
    }
    let luyKeMuaObj = {};
    let luyKeMua = muaATX ? muaATX.tongKhoiLuong : 0;
    luyKeMuaObj[`${type}`] = luyKeMua;
    for (let i = dsGia.length - 1; i >= 0; i--) {
      luyKeMua += dsMua.find((x) => x.gia == dsGia[i])
        ? dsMua.find((x) => x.gia == dsGia[i]).tongKhoiLuong
        : 0;
      luyKeMuaObj[dsGia[i]] = luyKeMua;
    }

    // tinh luy ke ban : ATO => thấp => cao
    let luyKeBanObj = {};
    let luyKeBan = banATX ? banATX.tongKhoiLuong : 0;
    luyKeBanObj[`${type}`] = luyKeBan;
    for (let i = 0; i < dsGia.length; i++) {
      luyKeBan += dsBan.find((x) => x.gia == dsGia[i])
        ? dsBan.find((x) => x.gia == dsGia[i]).tongKhoiLuong
        : 0;
      luyKeBanObj[dsGia[i]] = luyKeBan;
    }

    let obj = {};
    dsGia.map((x) => {
      obj[x] = Math.min(luyKeMuaObj[x], luyKeBanObj[x]);
    });
    let KLGDmax = Math.max(...Object.values(obj));
    obj = Object.keys(obj).filter((x) => obj[x] == KLGDmax);
    let giaKhop = 0;
    if (obj.length == 1) {
      giaKhop = obj[0];
    } else if (obj.length >= 1) {
      let ganVoiKhop = Math.min(...obj.map((x) => Math.abs(x - giaThamChieu)));
      let xyz = obj.filter((x) => Math.abs(x - giaThamChieu) == ganVoiKhop);
      if (xyz.length == 1) {
        giaKhop = xyz[0];
      } else if (xyz.length > 1) {
        giaKhop = Math.max(...xyz);
      }
    }
    dsGiaKhop[dataRow._id] = giaKhop;
  }
  return dsGiaKhop;
}

async function _doIt(exchange, isATO = false) {
  let coPhieus = await CoPhieu.find({ maSan: exchange });
  let type = isATO ? "ATO" : "ATC";
  let muaATXAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: TimeHelper.getToday(),
        loaiLenh: `mua ${type}`,
        maCoPhieu: { $in: global.stocks[exchange] },
        trangThai: "đã xác nhận",
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
  let banATXAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        maCoPhieu: { $in: global.stocks[exchange] },
        createdDay: TimeHelper.getToday(),
        loaiLenh: `bán ${type}`,
        trangThai: "đã xác nhận",
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
  let muaAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: TimeHelper.getToday(),
        loaiLenh: "mua LO",
        maCoPhieu: { $in: global.stocks[exchange] },
        trangThai: "đã xác nhận",
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
  let banAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        maCoPhieu: { $in: global.stocks[exchange] },
        createdDay: TimeHelper.getToday(),
        loaiLenh: "bán LO",
        trangThai: "đã xác nhận",
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
  let giaAll = await LenhGiaoDich.aggregate([
    {
      $match: {
        createdDay: TimeHelper.getToday(),
        maCoPhieu: { $in: global.stocks[exchange] },
        loaiLenh: { $ne: { $in: [`mua ${type}`, `bán ${type}`] } },
        gia: { $ne: `${type}` },
        trangThai: "đã xác nhận",
      },
    },
    {
      $group: {
        _id: "$maCoPhieu",
        gia: { $addToSet: "$gia" },
      },
    },
  ]);

  let dsGiaKhop = {};
  for (let dataRow of giaAll) {
    let dsGia = dataRow.gia.sort();
    let dsMua = muaAll.filter((x) => x.maCoPhieu == dataRow._id);
    let dsBan = banAll.filter((x) => x.maCoPhieu == dataRow._id);
    let muaATX = muaATXAll.find((x) => x.maCoPhieu == dataRow._id);
    let banATX = banATXAll.find((x) => x.maCoPhieu == dataRow._id);
    let giaThamChieu = coPhieus.find((x) => x._id == dataRow._id).giaThamChieu;

    let luyKeMuaObj = {};
    let luyKeMua = muaATX ? muaATX.tongKhoiLuong : 0;
    luyKeMuaObj[`${type}`] = luyKeMua;
    for (let i = dsGia.length - 1; i >= 0; i--) {
      luyKeMua += dsMua.find((x) => x.gia == dsGia[i])
        ? dsMua.find((x) => x.gia == dsGia[i]).tongKhoiLuong
        : 0;
      luyKeMuaObj[dsGia[i]] = luyKeMua;
    }
    // tinh luy ke ban : ATO => thấp => cao
    let luyKeBanObj = {};
    let luyKeBan = banATX ? banATX.tongKhoiLuong : 0;
    luyKeBanObj[`${type}`] = luyKeBan;
    for (let i = 0; i < dsGia.length; i++) {
      luyKeBan += dsBan.find((x) => x.gia == dsGia[i])
        ? dsBan.find((x) => x.gia == dsGia[i]).tongKhoiLuong
        : 0;
      luyKeBanObj[dsGia[i]] = luyKeBan;
    }
    let obj = {};
    dsGia.map((x) => {
      obj[x] = Math.min(luyKeMuaObj[x], luyKeBanObj[x]);
    });
    let KLGDmax = Math.max(...Object.values(obj));
    obj = Object.keys(obj).filter((x) => obj[x] == KLGDmax);
    let giaKhop = 0;
    if (obj.length == 1) {
      giaKhop = obj[0];
    } else if (obj.length >= 1) {
      let ganVoiKhop = Math.min(...obj.map((x) => Math.abs(x - giaThamChieu)));
      let xyz = obj.filter((x) => Math.abs(x - giaThamChieu) == ganVoiKhop);
      if (xyz.length == 1) {
        giaKhop = xyz[0];
      } else if (xyz.length > 1) {
        giaKhop = Math.max(...xyz);
      }
    }
    dsGiaKhop[dataRow._id] = giaKhop;
    let muaATXCP = await LenhGiaoDich.find({
      createdDay: TimeHelper.getToday(),
      loaiLenh: `mua ${type}`,
      maCoPhieu: dataRow._id,
      trangThai: "đã xác nhận",
    }).sort({ createdTime: -1 });
    let banATXCP = await LenhGiaoDich.find({
      createdDay: TimeHelper.getToday(),
      loaiLenh: `bán ${type}`,
      maCoPhieu: dataRow._id,
      trangThai: "đã xác nhận",
    }).sort({ createdTime: -1 });
    let muaCP = await LenhGiaoDich.find({
      createdDay: TimeHelper.getToday(),
      loaiLenh: "mua LO",
      maCoPhieu: dataRow._id,
      trangThai: "đã xác nhận",
      $expr: { $gte: [{ $toDouble: "$gia" }, giaKhop * 1] },
    }).sort({ gia: -1, createdTime: -1 });
    let muaCP2 = await LenhGiaoDich.find({
      createdDay: TimeHelper.getToday(),
      loaiLenh: "mua LO",
      maCoPhieu: dataRow._id,
      trangThai: "đã xác nhận",
      $expr: { $lt: [{ $toDouble: "$gia" }, giaKhop * 1] },
    }).sort({ gia: -1, createdTime: -1 });
    let banCP = await LenhGiaoDich.find({
      createdDay: TimeHelper.getToday(),
      loaiLenh: "bán LO",
      maCoPhieu: dataRow._id,
      trangThai: "đã xác nhận",
      $expr: { $lte: [{ $toDouble: "$gia" }, giaKhop * 1] },
    }).sort({ gia: 1, createdTime: -1 });
    let banCP2 = await LenhGiaoDich.find({
      createdDay: TimeHelper.getToday(),
      loaiLenh: "bán LO",
      maCoPhieu: dataRow._id,
      trangThai: "đã xác nhận",
      $expr: { $gt: [{ $toDouble: "$gia" }, giaKhop * 1] },
    }).sort({ gia: 1, createdTime: -1 });
    let dataKhop = [];
    for (let lenhMua of [...muaATXCP, ...muaCP]) {
      let khoiluongConLai = lenhMua.khoiLuongConLai;
      if (khoiluongConLai > 0) {
        for (let lenhBan of [...banATXCP, ...banCP]) {
          if (lenhBan.khoiLuongConLai == 0) continue;
          let khoiLuongKhop = Math.min(
            lenhMua.khoiLuongConLai,
            lenhBan.khoiLuongConLai
          );
          if (lenhMua.khoiLuongConLai >= lenhBan.khoiLuongConLai) {
            dataKhop.push({
              maLenhMua: lenhMua._id,
              maLenhBan: lenhBan._id,
              maCoPhieu: dataRow._id,
              khoiLuong: khoiLuongKhop,
              gia: giaKhop,
              createdDay: TimeHelper.getToday(),
              matchedTime: Date.now(),
            });
            khoiluongConLai = khoiluongConLai - khoiLuongKhop;
            lenhMua.khoiLuongConLai = khoiluongConLai;
            lenhBan.khoiLuongConLai = 0;
          } else if (lenhMua.khoiLuongConLai < lenhBan.khoiLuongConLai) {
            dataKhop.push({
              maLenhMua: lenhMua._id,
              maLenhBan: lenhBan._id,
              maCoPhieu: dataRow._id,
              khoiLuong: khoiLuongKhop,
              gia: giaKhop,
              createdDay: TimeHelper.getToday(),
              matchedTime: Date.now(),
            });
            lenhBan.khoiLuongConLai = lenhBan.khoiLuongConLai - khoiLuongKhop;
            lenhMua.khoiLuongConLai = 0;
            break;
          }
        }
      }
    }
    muaATXCP = muaATXCP.map(function (x) {
      if (x.khoiLuongConLai == 0)
        return { ...x._doc, trangThai: "khớp toàn bộ" };
      else if (x.khoiLuongConLai < x.khoiLuong)
        return { ...x._doc, trangThai: "khớp một phần" };
      else return { ...x._doc, trangThai: "đã hủy" };
    });
    banATXCP = banATXCP.map(function (x) {
      if (x.khoiLuongConLai == 0)
        return { ...x._doc, trangThai: "khớp toàn bộ" };
      else if (x.khoiLuongConLai < x.khoiLuong)
        return { ...x._doc, trangThai: "khớp một phần" };
      else return { ...x._doc, trangThai: "đã hủy" };
    });
    muaCP = muaCP.map(function (x) {
      if (x.khoiLuongConLai == 0)
        return { ...x._doc, trangThai: "khớp toàn bộ" };
      else if (x.khoiLuongConLai < x.khoiLuong)
        return { ...x._doc, trangThai: "khớp một phần" };
      else return { ...x._doc, trangThai: "đã hủy" };
    });
    muaCP2 = muaCP2.map(function (x) {
      return { ...x._doc, trangThai: "đã hủy" };
    });
    banCP = banCP.map(function (x) {
      if (x.khoiLuongConLai == 0)
        return { ...x._doc, trangThai: "khớp toàn bộ" };
      else if (x.khoiLuongConLai < x.khoiLuong)
        return { ...x._doc, trangThai: "khớp một phần" };
      else return { ...x._doc, trangThai: "đã hủy" };
    });
    banCP2 = banCP2.map(function (x) {
      return { ...x._doc, trangThai: "đã hủy" };
    });
    let listId = [
      ...muaATXCP,
      ...muaCP,
      ...banATXCP,
      ...banCP,
      ...muaCP2,
      ...banCP2,
    ].map((x) => x._id);
    if (listId.length) {
      await LenhGiaoDich.deleteMany({
        _id: { $in: listId },
      });
      await LenhGiaoDich.collection.insertMany([
        ...muaATXCP,
        ...muaCP,
        ...banATXCP,
        ...banCP,
        ...muaCP2,
        ...banCP2,
      ]);
    }
    if (dataKhop.length) {
      await GiaoDichKhop.collection.insertMany(dataKhop);
    }
  }
}

module.exports = {
  ATX: KhopPhienDinhKy,
  dsGiaKhop: dsGiaKhop,
};
