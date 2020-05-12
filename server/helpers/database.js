const CoPhieu = require("../models/coPhieu.model");
const GiaoDichKhop = require("../models/giaoDichKhop.model");
const LenhGiaoDich = require("../models/lenhGiaoDich.model");
const SanGiaoDich = require("../models/sanGiaoDich.model");
const TaiKhoan = require("../models/taiKhoan.model");
const SoDuTien = require("../models/soDuTien.model");
const bcrypt = require("../helpers/bcrypt");
const emitter = require("../emitter");
const TimeHelper = require("./time");
const coPhieuData = require('./coPhieuData')

let seedData = async () => {
  await _createSanGiaoDich();
  await _createTaiKhoan();
  await _createCoPhieu();
  await _createGiaoDich();
};

let _createSanGiaoDich = async () => {
  let result = await SanGiaoDich.find();
  if (!result.length) {
    let data = [{ _id: "HOSE" }, { _id: "HNX" }, { _id: "UPCOM" }];
    await SanGiaoDich.collection.insertMany(data);
    console.log("Khởi tạo dữ liệu sàn giao dịch thành công");
  } else {
    console.log("Đã có dữ liệu sàn giao dịch");
  }
};

let _createTaiKhoan = async () => {
  let result = await TaiKhoan.find();
  if (!result.length) {
    let data = [
      {
        tenTaiKhoan: "Phạm Đức Thành",
        tenDangNhap: "DragonLust",
        matKhau: await bcrypt.hash("123456"),
        ngaySinh: "10/13/1998",
        CMND: "013509993",
        ngayCap: "2012",
        noiCap: "Hà Nội",
        diaChi: "Hà Nội",
        soDienThoai: "0977098873",
        email: "thanhpd@gmail.com",
      },
      {
        tenTaiKhoan: "Cao Thành Luân",
        tenDangNhap: "CloudMIS",
        matKhau: await bcrypt.hash("123456"),
        ngaySinh: "10/13/1998",
        CMND: "013509993",
        ngayCap: "2012",
        noiCap: "Hà Nội",
        diaChi: "Hà Nội",
        soDienThoai: "0977098873",
        email: "luanct@gmail.com",
      },
      {
        tenTaiKhoan: "Lê Đình Thảo",
        tenDangNhap: "Creater",
        matKhau: await bcrypt.hash("123456"),
        ngaySinh: "10/13/1998",
        CMND: "013509993",
        ngayCap: "2012",
        noiCap: "Hà Nội",
        diaChi: "Hà Nội",
        soDienThoai: "0977098873",
        email: "admin@gmail.com",
      }
    ];
    await TaiKhoan.collection.insertMany(data);
    console.log("Khởi tạo dữ liệu tài khoản thành công");
  } else {
    console.log("Đã có dữ liệu tài khoản");
  }
};

let _createGiaoDich = async () => {
  let result = await LenhGiaoDich.find({ createdDay: TimeHelper.getToday() });
  if (!result.length) {
    emitter.emit("initData");
    console.log("Khởi tạo dữ liệu giao dịch thành công");
  } else {
    console.log("Đã có dữ liệu giao dịch");
  }
};
let _createCoPhieu = async () => {
  let result = await CoPhieu.find();
  if (!result.length) {
    let data = coPhieuData;
    await CoPhieu.collection.insertMany(data);
    console.log("Khởi tạo dữ liệu cổ phiếu thành công");
  } else {
    console.log("Đã có dữ liệu cổ phiếu");
  }
};

module.exports = {
  seedData: seedData,
};
