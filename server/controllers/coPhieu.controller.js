let CoPhieu = require("../models/coPhieu.model");

let create = (req, res) => {
  const _id = req.body.id;
  const maSan = req.body.maSan;
  const giaTran = req.body.giaTran;
  const giaSan = req.body.giaSan;
  const giaThamChieu = req.body.giaThamChieu;
  const coPhieu = new CoPhieu({
    _id: _id,
    maSan: maSan,
    giaTran: giaTran,
    giaSan: giaSan,
    giaThamChieu: giaThamChieu,
  });
  coPhieu
    .save(req)
    .then(() => res.json("Them thanh cong co phieu!"))
    .catch((err) => res.json({ "Error: ": err.toString() }));
};

let getAll = (req, res) => {
  CoPhieu.find()
    .then((coPhieu) => res.json(coPhieu))
    .catch((err) => res.status(400).json("Error: " + err));
};

let searchByExchangeId = async (req, res) => {
  let maSan = req.params.maSan;
  let coPhieus = await CoPhieu.find({ maSan: maSan });
  let result = [];
  for (let coPhieu of coPhieus) {
    result.push(coPhieu._id);
  }
  res.json({ stocks: result });
};

let searchById = async (req, res) => {
  let id = req.params.id;
  let coPhieu = await CoPhieu.find({ _id: id });
  res.json({ stock: coPhieu });
};

module.exports = {
  create: create,
  getAll: getAll,
  searchById: searchById,
  searchByExchangeId: searchByExchangeId,
};
