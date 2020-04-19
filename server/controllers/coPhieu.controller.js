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
    .catch((err) => res.json({"Error: ": err.toString()}));
};

module.exports = {
  create: create,
};
