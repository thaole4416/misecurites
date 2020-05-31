const taiKhoanRoute = require("./taiKhoan.route");
const sanGiaoDichRoute = require("./sanGiaoDich.route");
const coPhieuRoute = require("./coPhieu.route");
const lenhGiaoDichRoute = require("./lenhGiaoDich.route");
const giaoDichKhopRoute = require("./giaoDichKhop.route");
const otpRoute = require("./otp.route");
const soDuCoPhieuRoute = require("./soDuCoPhieu.route");

const routes = [
  taiKhoanRoute,
  sanGiaoDichRoute,
  coPhieuRoute,
  lenhGiaoDichRoute,
  giaoDichKhopRoute,
  otpRoute,
  soDuCoPhieuRoute
];

module.exports = routes;
