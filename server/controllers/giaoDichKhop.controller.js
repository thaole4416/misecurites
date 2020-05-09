const TimeHelper = require('../helpers/time')
let GiaoDichKhop = require("../models/giaoDichKhop.model");
const emitter = require('../emitter')

let getAll = (req, res) => {
    GiaoDichKhop.find({createdDay: TimeHelper.getToday()})
    .then((giaoDichKhop) => res.json(giaoDichKhop))
    .catch((err) => res.status(400).json("Error: " + err));
};
let clearAll = (req, res) => {
  GiaoDichKhop.deleteMany()
  .then((giaoDichKhop) => res.json(giaoDichKhop))
  .catch((err) => res.status(400).json("Error: " + err));
};
module.exports = {
  getAll: getAll,
  clearAll: clearAll
};
