const TaiKhoan = require("../models/taiKhoan.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("../helpers/bcrypt");

const verifyJwtToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

const tokenCheck = async (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

  if (token) {
    try {
      const decoded = await verifyJwtToken(token, process.env.JWT_SECRET);
      req.userInfo = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({status: "FAIL",
          message: "Token expired.",
        });
      }
      console.error(err.name);
      return res.status(401).json({status: "FAIL",
        message: "Unauthorized access.",
      });
    }
  } else {
    return res.status(403).send({status: "FAIL",
      message: "No token provided.",
    });
  }
};

const requireAuth = async (req, res, next) => {
  const taiKhoan = TaiKhoan.findOne({ _id: req.userInfo.id });
  if (taiKhoan) {
    next();
  } else {
    res.json({status: "FAIL", message: "Đăng nhập để thực hiện" });
  }
};

const requireAuth2 = async (req, res, next) => {
  const taiKhoan = TaiKhoan.findOne({ _id: req.userInfo.id });
  const matKhau = req.body.password;
  if (await bcrypt.compare(matKhau, taiKhoan.matKhau)) {
    next();
  } else {
    res.json({ status: "FAIL", message: "Nhập mật khẩu sai" });
  }
};

module.exports = {
  tokenCheck: tokenCheck,
  requireAuth: requireAuth,
  requireAuth2: requireAuth2,
};
