const express = require("express");
const route = express.Router();
const lenhGiaoDichController = require("../controllers/lenhGiaoDich.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const base_uri = "/lenhGiaoDich";
const helper = require("../helpers/MatchOrder");

/**
 {
      "maTaiKhoan": 1586962300499,
     "maCoPhieu": "VNG",
     "loaiLenh": "mua",
     "khoiLuong": 1000,
     "gia": 20000
 }
 */
route.get(base_uri + "/", lenhGiaoDichController.getAll);
route.post(
  base_uri + "/",
  authMiddleware.tokenCheck,
  lenhGiaoDichController.create
);
route.delete(base_uri + "/", lenhGiaoDichController.clearAll);
route.get(
  base_uri + "/test",
  authMiddleware.tokenCheck,
  lenhGiaoDichController.test
);
route.get(base_uri + "/ATX", helper.ATX);

module.exports = route;
