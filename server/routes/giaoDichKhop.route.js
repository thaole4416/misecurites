const express = require("express");
const route = express.Router();
const giaoDichKhopController = require("../controllers/giaoDichKhop.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const base_uri = "/giaoDichKhop";

/**
 {
      "maTaiKhoan": 1586962300499,
     "maCoPhieu": "VNG",
     "loaiLenh": "mua",
     "khoiLuong": 1000,
     "gia": 20000
 }
 */
route.get(base_uri+"/", giaoDichKhopController.getAll);
route.delete(base_uri+"/", giaoDichKhopController.clearAll);

module.exports = route;