import axios from "axios";
import { BASE_URL } from "../constants";

export const genOtp = async (action) => {
    console.log(action)
  try {
    var response = await axios({
      method: "post",
      url: BASE_URL + "/otp/gen",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${action.payload}`,
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(response);
  return response.data;
};

export const verifyOtp = async (action) => {
  var response = await axios({
    method: "post",
    url: BASE_URL + "/otp/verify",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${action.payload.token}`,
    },
    data: {
      otpCode: action.payload.otpCode,
    },
  });
  console.log(response);
  return response.data;
};
