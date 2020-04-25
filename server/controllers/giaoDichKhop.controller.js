const Util = require('../utils')
let GiaoDichKhop = require("../models/giaoDichKhop.model");
const emitter = require('../emitter')

let getAll = (req, res) => {
    GiaoDichKhop.find({createdDay: Util.getToday()})
    .then((giaoDichKhop) => res.json(giaoDichKhop))
    .catch((err) => res.status(400).json("Error: " + err));
};

module.exports = {
  getAll: getAll,
};
