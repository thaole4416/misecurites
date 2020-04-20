const express = require("express");
var route = express.Router();
var sanGiaoDichController = require("../controllers/sanGiaoDich.controller");
const base_uri = "/sanGiaoDich";

route.get(base_uri+"/", sanGiaoDichController.getAll);
route.get(base_uri+"/subcribe/:maSan", sanGiaoDichController.subcribeExc);
route.post(base_uri+"/", sanGiaoDichController.create);

module.exports = route;