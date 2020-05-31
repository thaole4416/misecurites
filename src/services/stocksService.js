import axios from "axios";
import { BASE_URL } from "../constants";
axios.defaults.baseURL = "localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
export const getExcsList = async () => {
  //   await fetch("http://"+BASE_URL+ "/sanGiaoDich")
  return await axios({
    method: "get",
    url: BASE_URL + "/sanGiaoDich",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
};

export const getAllStocks = async () => {
  return await axios({
    method: "get",
    url: BASE_URL + "/coPhieu",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
};

export const order = async (action) => {
  let response = await axios({
    method: "post",
    url: BASE_URL + "/lenhGiaoDich",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${action.payload.token}`,
    },
    data: {
      maCoPhieu: action.payload.maCoPhieu,
      loaiLenh: action.payload.loaiLenh,
      khoiLuong: action.payload.khoiLuong,
      gia: action.payload.gia,
      maSan: action.payload.maSan,
    },
  });
  return response.data;
};

export const getHistory = async (action) => {
  let response = await axios({
    method: "get",
    url: BASE_URL + "/lenhGiaoDich/history",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${action.payload}`,
    },
  });
  return response.data;
};