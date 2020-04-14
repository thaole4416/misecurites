const express = require("express");
var route = express.Router();
var sanGiaoDichController = require("../controllers/sanGiaoDich.controller");


route.get("/", sanGiaoDichController.getAll);
route.post("/", sanGiaoDichController.create);

module.exports = route;