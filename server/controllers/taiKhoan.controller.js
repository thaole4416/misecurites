const TaiKhoan = require("../models/taiKhoan.model");
const bcrypt = require("../helpers/bcrypt")
const jwt = require("jsonwebtoken");
const tokenList = {};

let getAll = (req, res) => {
  console.log(req.userInfo);
  TaiKhoan.find()
    .then((SanGiaoDich) => res.json(SanGiaoDich))
    .catch((err) => res.status(400).json("Error: " + err));
};

let login = async (req, res) => {
  let tenDangNhap = req.body.tenDangNhap;
  let matKhau = req.body.matKhau;
  let taiKhoan = await TaiKhoan.findOne({
    tenDangNhap: tenDangNhap,
  });
  if (taiKhoan) {
    let checkPassword = await bcrypt.compare(matKhau, taiKhoan.matKhau);
    if (checkPassword) {
      const user = {
        id: taiKhoan._id,
        email: taiKhoan.email,
        username: taiKhoan.tenDangNhap,
      };
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE,
      });

      const refreshToken = jwt.sign(user, process.env.REFRESH_JWT_SECRET, {
        expiresIn: process.env.REFRESH_JWT_LIFE,
      });

      tokenList[refreshToken] = user;

      res.json({
        status: "OK",
        message: "Đăng nhập thành công",
        data: {
          id: taiKhoan._id,
          username: tenDangNhap,
          token: token,
          refreshToken: refreshToken,
        },
      });
    } else {
      res.json({ status: "FAIL", message: "Mật khẩu không đúng" });
    }
  } else {
    res.json({ status: "FAIL", message: "Tên đăng nhập không tồn tại" });
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

  let hashNewPassword = await bcrypt.hash(matKhau);
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
  let hashNewPassword = await bcrypt.hash(newPassword);
  TaiKhoan.findByIdAndUpdate(_id, { matKhau: hashNewPassword })
    .then((data) => res.json(data))
    .catch((err) => res.json("Error: " + err));
};

/**
 * Lấy mã token mới sử dụng Refresh token
 * POST /refresh_token
 */
// router.post('/refresh_token', async (req, res) => {
//   // User gửi mã Refresh token kèm theo trong body
//   const { refreshToken } = req.body;

//   // Kiểm tra Refresh token có được gửi kèm và mã này có tồn tại trên hệ thống hay không
//   if ((refreshToken) && (refreshToken in tokenList)) {

//     try {
//       // Kiểm tra mã Refresh token
//       await utils.verifyJwtToken(refreshToken, config.refreshTokenSecret);

//       // Lấy lại thông tin user
//       const user = tokenList[refreshToken];

//       // Tạo mới mã token và trả lại cho user
//       const token = jwt.sign(user, config.secret, {
//         expiresIn: config.tokenLife,
//       });
//       const response = {
//         token,
//       }
//       res.status(200).json(response);
//     } catch (err) {
//       console.error(err);
//       res.status(403).json({
//         message: 'Invalid refresh token',
//       });
//     }
//   } else {
//     res.status(400).json({
//       message: 'Invalid request',
//     });
//   }
// });


module.exports = {
  login: login,
  register: register,
  getAll: getAll,
  changePassword: changePassword,
  //   viewProfile: viewProfile,
};
