const LenhGiaoDich = require("../models/lenhGiaoDich.model");
const CoPhieu = require("../models/coPhieu.model");
const TimeHelper = require("./time");
const orderType = {
  buy: "mua",
  sell: "bán",
};
async function KhopPhienDinhKy(req, res) {
  //check ATO
  if (1 == 1) {
    let exchange = "HOSE";
    let coPhieus = await CoPhieu.find({ maSan: exchange });
    let muaATOAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          loaiLenh: "mua ATO",
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
    let banATOAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          maCoPhieu: { $in: global.stocks[exchange] },
          createdDay: TimeHelper.getToday(),
          loaiLenh: "bán ATO",
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
          loaiLenh: { $ne: { $in: ["mua ATO", "bán ATO"] } },
          gia: { $ne: "ATO" },
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
      let muaATO = muaATOAll.find((x) => x.maCoPhieu == dataRow._id);
      let banATO = banATOAll.find((x) => x.maCoPhieu == dataRow._id);
      let giaThamChieu = coPhieus.find((x) => x._id == dataRow._id);

      let luyKeMuaObj = {};
      let luyKeMua = muaATO ? muaATO.tongKhoiLuong : 0;
      luyKeMuaObj["ATO"] = luyKeMua;
      for (let i = dsGia.length - 1; i >= 0; i--) {
        luyKeMua += dsMua.find((x) => x.gia == dsGia[i])
          ? dsMua.find((x) => x.gia == dsGia[i]).tongKhoiLuong
          : 0;
        luyKeMuaObj[dsGia[i]] = luyKeMua;
      }

      // tinh luy ke ban : ATO => thấp => cao
      let luyKeBanObj = {};
      let luyKeBan = banATO ? banATO.tongKhoiLuong : 0;
      luyKeBanObj["ATO"] = luyKeBan;
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
        let ganVoiKhop = Math.min(...obj.map((x) => Math.abs(x - 10000)));
        let xyz = obj.filter((x) => Math.abs(x - 10000) == ganVoiKhop);
        if (xyz.length == 1) {
          giaKhop = xyz[0];
        } else if (xyz.length > 1) {
          giaKhop = Math.max(...xyz);
        }
      }
      dsGiaKhop[dataRow._id] = giaKhop;

      let muaATOCP = await LenhGiaoDich.find({
        createdDay: TimeHelper.getToday(),
        loaiLenh: "mua ATO",
        maCoPhieu: dataRow._id,
      }).sort({ createdTime: -1 });
      let banATOCP = await LenhGiaoDich.find({
        createdDay: TimeHelper.getToday(),
        loaiLenh: "bán ATO",
        maCoPhieu: dataRow._id,
      }).sort({ createdTime: -1 });
      let muaCP = await LenhGiaoDich.find({
        createdDay: TimeHelper.getToday(),
        loaiLenh: "mua LO",
        maCoPhieu: dataRow._id,
        $expr: { $gte: [{ $toDouble: "$gia" }, giaKhop * 1] },
      }).sort({ gia: -1, createdTime: -1 });
      let banCP = await LenhGiaoDich.find({
        createdDay: TimeHelper.getToday(),
        loaiLenh: "bán LO",
        maCoPhieu: dataRow._id,
        $expr: { $lte: [{ $toDouble: "$gia" }, giaKhop * 1] },
      }).sort({ gia: 1, createdTime: -1 });
      let dataKhop = [];
      console.log([...muaATOCP, ...muaCP]);
      console.log(banATOCP);
      for (let lenhMua of [...muaATOCP, ...muaCP]) {
        let khoiluongConLai = lenhMua.khoiLuongConLai;
        if (khoiluongConLai > 0) {
          for (let lenhBan of [...banATOCP, ...banCP]) {
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
      console.log(muaATOCP);
      console.log(banATOCP);
      console.log(dataKhop);
      //mua
      //khop mua ATO voi ban ATO ---gia khop lenh
      //khop gia mua cao voi gia ban thap

      //khong xac dinh duoc gia mo cua thi thoi
    }

    try {
      res.json({
        giaAll2: giaAll,
        dsGiaKhop: dsGiaKhop,
      });
    } catch (err) {
      res.json(err);
    }
  }
}

module.exports = {
  ATX: KhopPhienDinhKy,
};
