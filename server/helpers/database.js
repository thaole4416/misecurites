const CoPhieu = require("../models/coPhieu.model");
const GiaoDichKhop = require("../models/giaoDichKhop.model");
const LenhGiaoDich = require("../models/lenhGiaoDich.model");
const SanGiaoDich = require("../models/sanGiaoDich.model");
const TaiKhoan = require("../models/taiKhoan.model");
const SoDuTien = require("../models/soDuTien.model");
const SoDuCoPhieu = require("../models/soDuCoPhieu.model");
const bcrypt = require("../helpers/bcrypt");
const emitter = require("../emitter");
const TimeHelper = require("./time");
const coPhieuData = require("./coPhieuData");

async function seedData() {
  await _createSanGiaoDich();
  await _createTaiKhoan();
  await _createCoPhieu();
  await _createGiaoDich();
  await _createDanhMuc();
}

async function _createSanGiaoDich() {
  let result = await SanGiaoDich.find();
  if (!result.length) {
    let data = [{ _id: "HOSE" }, { _id: "HNX" }, { _id: "UPCOM" }];
    await SanGiaoDich.collection.insertMany(data);
    console.log("Khởi tạo dữ liệu sàn giao dịch thành công");
  } else {
    console.log("Đã có dữ liệu sàn giao dịch");
  }
}

async function _createTaiKhoan() {
  let result = await TaiKhoan.find();
  if (!result.length) {
    let data = [
      {
        _id: "29A000001",
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
        isConfirm: "true"
      },
      {
        _id: "29A000002",
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
        isConfirm: "true"
      },
      {
        _id: "29A000003",
        tenTaiKhoan: "Lê Đình Thảo",
        tenDangNhap: "Creator",
        matKhau: await bcrypt.hash("123456"),
        ngaySinh: "10/13/1998",
        CMND: "013509993",
        ngayCap: "2012",
        noiCap: "Hà Nội",
        diaChi: "Hà Nội",
        soDienThoai: "0977098873",
        email: "admin@gmail.com",
        isConfirm: "true"
      },
    ];
    await TaiKhoan.collection.insertMany(data);
    await SoDuTien.collection.insertMany([
      { maTaiKhoan: "29A000001", soDu: 100000000 },
      { maTaiKhoan: "29A000002", soDu: 100000000 },
      { maTaiKhoan: "29A000003", soDu: 999999999999 },
    ]);
    console.log("Khởi tạo dữ liệu tài khoản thành công");
  } else {
    console.log("Đã có dữ liệu tài khoản");
  }
}

async function _createGiaoDich() {
  let result = await LenhGiaoDich.find({ createdDay: TimeHelper.getToday() });
  if (!result.length) {
    console.log("Khởi tạo dữ liệu giao dịch thành công");
  } else {
    console.log("Đã có dữ liệu giao dịch");
  }
}
async function _createCoPhieu() {
  let result = await CoPhieu.find();
  if (!result.length) {
    let data = coPhieuData;
    await CoPhieu.collection.insertMany(data);
    console.log("Khởi tạo dữ liệu cổ phiếu thành công");
  } else {
    console.log("Đã có dữ liệu cổ phiếu");
  }
}

async function _createDanhMuc() {
  let result = await SoDuCoPhieu.find();
  if (!result.length) {
    let data = [];
    try {
      let coPhieus = await CoPhieu.find();
      for (let i = 0; i < 5; i++) {
        data.push(
          {
            maCoPhieu: coPhieus[Math.round(Math.random() * coPhieus.length)]._id,
            maTaiKhoan: "29A000001",
            khoiLuong: 100000,
          },
          {
            maCoPhieu: coPhieus[Math.round(Math.random() * coPhieus.length)]._id,
            maTaiKhoan: "29A000002",
            khoiLuong: 100000,
          },
          {
            maCoPhieu: coPhieus[Math.round(Math.random() * coPhieus.length)]._id,
            maTaiKhoan: "29A000003",
            khoiLuong: 100000,
          },
          {
            maCoPhieu: coPhieus[Math.round(Math.random() * coPhieus.length)]._id,
            maTaiKhoan: "STB",
            khoiLuong: 100000,
          }
        );
      }
    } catch (error) {}
    await SoDuCoPhieu.collection.insertMany(data);
    console.log("Khởi tạo dữ liệu danh muc cổ phiếu thành công");
  } else {
    console.log("Đã có dữ liệu danh muc cổ phiếu");
  }
}

module.exports = {
  seedData: seedData,
};
