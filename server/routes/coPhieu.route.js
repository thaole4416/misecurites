const express = require("express");
const route = express.Router();
const coPhieuController = require("../controllers/coPhieu.controller");
const base_uri = "/coPhieu";

/**
 {
    "id":"CNG",
"maSan":"HOSE",
"giaTran":26600,
"giaSan":23200,
"giaThamChieu":24500
}
 */
route.post(base_uri + "/", coPhieuController.create);

module.exports = route;
