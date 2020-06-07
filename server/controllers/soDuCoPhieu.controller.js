const SoDuCoPhieu = require("../models/soDuCoPhieu.model");
const LenhGiaoDich = require("../models/lenhGiaoDich.model");
const GiaoDichKhop = require("../models/giaoDichKhop.model");
const TimeHelper = require("../helpers/time");

async function danhMuc(req, res) {
  let previousDay = TimeHelper.getpreviousDays();
  let result1 = await SoDuCoPhieu.find({ maTaiKhoan: req.userInfo.id });
  let result2 = await LenhGiaoDich.aggregate([
    {
      $match: {
        maTaiKhoan: req.userInfo.id,
        loaiLenh: {
          $in: [
            "bán LO",
            "bán MP",
            "bán ATO",
            "bán ATC",
            "bán MOK",
            "bán MAK",
            "bán MTL",
          ],
        },
        createdDay: {
          $in: [
            TimeHelper.getDate(previousDay[0]),
            TimeHelper.getDate(previousDay[1]),
            TimeHelper.getToday(),
          ],
        },
      },
    },
    {
      $group: {
        _id: { maCoPhieu: "$maCoPhieu" },
        tongKL: { $sum: { $subtract: ["$khoiLuong", "$khoiLuongConLai"] } },
      },
    },
    {
      $project: {
        _id: 0,
        maCoPhieu: "$_id.maCoPhieu",
        tongKL: 1,
      },
    },
    { $match: { tongKL: { $ne: 0 } } },
  ]);
  let result3 = await LenhGiaoDich.aggregate([
    {
      $match: {
        maTaiKhoan: req.userInfo.id,
        loaiLenh: {
          $in: [
            "mua LO",
            "mua MP",
            "mua ATO",
            "mua ATC",
            "mua MOK",
            "mua MAK",
            "mua MTL",
          ],
        },
        createdDay: {
          $in: [
            TimeHelper.getDate(previousDay[0]),
            TimeHelper.getDate(previousDay[1]),
            TimeHelper.getToday(),
          ],
        },
      },
    },
    {
      $group: {
        _id: { maCoPhieu: "$maCoPhieu" },
        tongKL: { $sum: { $subtract: ["$khoiLuong", "$khoiLuongConLai"] } },
      },
    },
    {
      $project: {
        _id: 0,
        maCoPhieu: "$_id.maCoPhieu",
        tongKL: 1,
      },
    },
    { $match: { tongKL: { $ne: 0 } } },
  ]);
  let result = [];
  let stockList = [];
  for (let row of [...result1, ...result2, ...result3]) {
    if (stockList.find((x) => x === row.maCoPhieu)) continue;
    else stockList.push(row.maCoPhieu);
  }
  for (let id of stockList) {
    result.push({
      maCoPhieu: id,
      khoiLuong: result1.find((x) => x.maCoPhieu == id)
        ? result1.find((x) => x.maCoPhieu == id).khoiLuong
        : 0,
      ban: result2.find((x) => x.maCoPhieu == id)
        ? result2.find((x) => x.maCoPhieu == id).tongKL
        : 0,
      choVe: result3.find((x) => x.maCoPhieu == id)
        ? result3.find((x) => x.maCoPhieu == id).tongKL
        : 0,
    });
  }
  if (1 == 1) {
    res.json({ status: "OK", data: result });
  }
}
module.exports = {
  danhMuc: danhMuc,
};
