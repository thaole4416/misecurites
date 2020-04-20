const express = require("express");
var route = express.Router();
var lenhGiaoDichController = require("../controllers/lenhGiaoDich.controller");
const base_uri = "/lenhGiaoDich";

/**
 {
      "maTaiKhoan": 1586962300499,
     "maCoPhieu": "VNG",
     "loaiLenh": "mua",
     "khoiLuong": 1000,
     "gia": 20000
 }
 */
route.get(base_uri+"/", lenhGiaoDichController.getAll);
route.post(base_uri+"/", lenhGiaoDichController.create);

module.exports = route;