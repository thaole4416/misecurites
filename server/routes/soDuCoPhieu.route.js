const express = require("express");
const route = express.Router();
const soDuCoPhieuController = require("../controllers/soDuCoPhieu.controller");
const base_uri = "/soDuCoPhieu";
const authMiddleware = require("../middlewares/auth.middleware");

route.get(base_uri + "/", authMiddleware.tokenCheck, soDuCoPhieuController.danhMuc);

module.exports = route;
