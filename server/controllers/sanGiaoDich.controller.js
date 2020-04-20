let SanGiaoDich = require("../models/sanGiaoDich.model");
let CoPhieu = require('../models/coPhieu.model')
let _getAll = (req, res) => {
  SanGiaoDich.find()
    .then((SanGiaoDich) => res.json(SanGiaoDich))
    .catch((err) => res.status(400).json("Error: " + err));
};

let _create = (req, res) => {
  const id = req.body.id;
  const sanGiaoDich = new SanGiaoDich({ _id: id });
  sanGiaoDich
    .save()
    .then(() => res.json("Them thanh cong san giao dich!"))
    .catch((err) => res.status(400).json("Error: " + err));
};

let subcribeExc = async(req,res) => {
  let maSan = req.params.maSan;
  let symbolsList = await CoPhieu.find({ maSan: maSan }).select({_id:1,giaTran:1,giaSan:1,giaThamChieu:1});
  res.json({ symbolsList: symbolsList });
}

module.exports = {
  getAll: _getAll,
  create: _create,
  subcribeExc:subcribeExc
};
