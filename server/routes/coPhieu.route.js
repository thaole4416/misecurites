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
route.get(base_uri + "/", coPhieuController.getAll);
route.get(base_uri + "/searchByExchangeId/:maSan", coPhieuController.searchByExchangeId);
route.get(base_uri + "/searchById/:id", coPhieuController.searchById);
route.post(base_uri + "/", coPhieuController.create);

module.exports = route;
