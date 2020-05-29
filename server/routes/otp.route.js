const express = require("express");
const route = express.Router();
const otpController = require("../controllers/otp.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const base_uri = "/otp";


route.post(base_uri+"/gen",authMiddleware.tokenCheck, otpController.genOtp);
route.post(base_uri+"/verify",authMiddleware.tokenCheck, otpController.verifyOtp);

module.exports = route;