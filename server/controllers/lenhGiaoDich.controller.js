let LenhGiaoDich = require("../models/lenhGiaoDich.model");

let create = (req, res) => {
  const maTaiKhoan = req.body.maTaiKhoan;
  const maCoPhieu = req.body.maCoPhieu;
  const loaiLenh = req.body.loaiLenh;
  const khoiLuong = req.body.khoiLuong;
  const gia = req.body.gia;
  const coPhieu = new LenhGiaoDich({
     maTaiKhoan: maTaiKhoan,
     maCoPhieu: maCoPhieu,
     loaiLenh: loaiLenh,
     khoiLuong: khoiLuong,
     gia: gia
  });
  coPhieu
    .save(req)
    .then(() => res.json("Them thanh cong lenh!"))
    .catch((err) => res.json({ "Error: ": err.toString() }));
};

let getAll = (req, res) => {
  LenhGiaoDich.find()
    .then((lenh) => res.json(lenh))
    .catch((err) => res.status(400).json("Error: " + err));
};

module.exports = {
  create: create,
  getAll: getAll,
};
