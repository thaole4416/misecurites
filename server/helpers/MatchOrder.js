const LenhGiaoDich = require("../models/lenhGiaoDich.model");
const TimeHelper = require("./time");
const orderType = {
  buy: "mua",
  sell: "bán",
};
async function KhopPhienDinhKy(req, res) {
  //check ATO
  if (1 == 1) {
    let exchange = "HOSE";
    let muaAll = await LenhGiaoDich.aggregate([
      {
        $match: {
          createdDay: TimeHelper.getToday(),
          loaiLenh: { $regex: /mua*/g },
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
          loaiLenh: { $regex: /bán*/g },
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

    let giaAll = await LenhGiaoDich.find({
      maCoPhieu: { $in: global.stocks[exchange] },
      createdDay: TimeHelper.getToday(),
    }).distinct("gia");

    for (let stock of global.stocks[exchange])
    //map lai muaAll banAll
    //for stock in global.stocks[exchange]

    // tinh luy ke mua : ATO => cao => thấp
    let luyKeMuaObj = {};
    let luyKeMua = 0;
    for (let i = giaAll.length - 1; i >= 0; i--) {
      luyKeMua += muaAll.find((x) => x.gia == giaAll[i])
        ? muaAll.find((x) => x.gia == giaAll[i]).tongKhoiLuong
        : 0;
      luyKeMuaObj[giaAll[i]] = luyKeMua;
    }

    // tinh luy ke ban : ATO => thấp => cao
    let luykeBanObj = {};
    let luyKeBan = banAll.find((x) => x.gia == "ATO")
      ? banAll.find((x) => x.gia == "ATO").tongKhoiLuong
      : 0;
    luykeBanObj["ATO"] = luyKeBan;
    for (let i = 0; i < giaAll.length - 1; i++) {
      luyKeBan += banAll.find((x) => x.gia == giaAll[i])
        ? banAll.find((x) => x.gia == giaAll[i]).tongKhoiLuong
        : 0;
      luykeBanObj[giaAll[i]] = luyKeBan;
    }

    let obj = {};
    giaAll.map((x) => {
      obj[x] = Math.min(luyKeMuaObj[x], luykeBanObj[x]);
    });

    let KLGDmax = Math.max(...Object.values(obj));
    obj = Object.keys(obj).filter((x) => obj[x] == KLGDmax );

    // tim ra gia khop

    //khop lenh theo gia khop

    try {
      res.json({
        muaAll: muaAll,
        banAll: banAll,
        giaAll: giaAll,
        KLGDmax: KLGDmax,
        obj: obj,
      });
    } catch (err) {
      res.json(err);
    }
  }

  // xac dinh gia mo cua
  //neu xac dinh gia mo cua thuc hien khop
  //mua
  //khop mua ATO voi ban ATO ---gia khop lenh
  //khop gia mua cao voi gia ban thap

  //khong xac dinh duoc gia mo cua thi thoi
}

module.exports = {
  ATX: KhopPhienDinhKy,
};
