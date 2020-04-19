const TaiKhoan = require("../models/taiKhoan.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let getAll = (req, res) => {
  TaiKhoan.find()
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

let login = async (req, res) => {
  let tenDangNhap = req.body.tenDangNhap;
  let matKhau = req.body.matKhau;
  let taiKhoan = await TaiKhoan.findOne({
    tenDangNhap: tenDangNhap,
  }).select('matKhau');
  let checkPassword = await bcrypt.compare(matKhau, taiKhoan.matKhau);
  if (checkPassword) {
    res.cookie("userId", taiKhoan._id, { signed: true });
    res.json({ message: "Đăng nhập thành công" });
  } else {
    res.json({ message: "Thông tin tài khoản hoặc mật khẩu không đúng" });
  }
};

let register = async (req, res) => {
  let id = Date.now();
  let tenTaiKhoan = req.body.tenTaiKhoan;
  let tenDangNhap = req.body.tenDangNhap;
  let matKhau = req.body.matKhau;
  let ngaySinh = req.body.ngaySinh;
  let CMND = req.body.CMND;
  let ngayCap = req.body.ngayCap;
  let noiCap = req.body.noiCap;
  let diaChi = req.body.diaChi;
  let soDienThoai = req.body.soDienThoai;
  let email = req.body.email;

  let hashNewPassword = await bcrypt.hash(matKhau, saltRounds);
  if (
    !(await TaiKhoan.findOne(
      { tenDangNhap: tenDangNhap },
      (data) => data
    ).exec())
  ) {
    var taiKhoan = new TaiKhoan({
      _id: id,
      tenTaiKhoan: tenTaiKhoan,
      tenDangNhap: tenDangNhap,
      matKhau: hashNewPassword,
      ngaySinh: ngaySinh,
      CMND: CMND,
      ngayCap: ngayCap,
      noiCap: noiCap,
      diaChi: diaChi,
      soDienThoai: soDienThoai,
      email: email,
    });
    taiKhoan
      .save()
      .then((doc) => res.json(doc))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    res.status(400).json("Tên đăng nhập đã tồn tại");
  }
};

let changePassword = async (req, res) => {
  let _id = req.body.id;
  let newPassword = req.body.newPassword;
  let hashNewPassword = await bcrypt.hash(newPassword, saltRounds);
  TaiKhoan.findByIdAndUpdate(_id, { matKhau: hashNewPassword })
    .then((data) => res.json(data))
    .catch((err) => res.json("Error: " + err));
};

module.exports = {
  login: login,
  register: register,
  getAll: getAll,
  changePassword: changePassword,
  //   viewProfile: viewProfile,
};
