let SoDuCoPhieu = require("../models/soDuCoPhieu.model");

async function danhMuc(req, res) {
  let result = await SoDuCoPhieu.find({maTaiKhoan: req.userInfo.id});
  if (result) {
    res.json({ status: "OK", data: result });
  }
}
module.exports = {
  danhMuc: danhMuc,
};
