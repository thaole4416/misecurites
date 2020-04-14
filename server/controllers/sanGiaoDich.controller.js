const router = require("express").Router();
let SanGiaoDich = require("../models/sanGiaoDich.model");

let getAll = (req, res) => {
  SanGiaoDich.find()
    .then((SanGiaoDich) => res.json(SanGiaoDich))
    .catch((err) => res.status(400).json("Error: " + err));
};

let create = (req, res) => {
  const id = req.body.id;
  const sanGiaoDich = new SanGiaoDich({ _id: id });
  sanGiaoDich
    .save()
    .then(() => res.json("Them thanh cong san giao dich!"))
    .catch((err) => res.status(400).json("Error: " + err));
};

module.exports = {
  getAll: getAll,
  create: create,
};
