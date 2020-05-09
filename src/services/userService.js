
import axios from "axios";
import { BASE_URL } from "../constants";

export const login = async (postData) => {
  var x = await axios({
    method: "post",
    url: BASE_URL + "/taiKhoan/login",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    data: {
      "tenDangNhap": postData.username,
      "matKhau": postData.password
    },
  });
  console.log(x)
  return x.data;
};

export const getAll = async (token) => {
  var x = await axios({
    method: "get",
    url: BASE_URL + "/taiKhoan/",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      // "Authorization": "Bearer " + JSON.parse(localStorage.getItem("userInfo")).token || token
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjY2Mjg1MTk5MTI5MzlmNGVjNzViNiIsImVtYWlsIjoidGhhbmhwZEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkRyYWdvbkx1c3QiLCJpYXQiOjE1ODkwMjg1MDksImV4cCI6MTU4OTAyOTQwOX0.tHQjyBKfXOzoZWE0CIP9kmWJQ6zCua9CUrdwRwGZCyc"
    },
  });
  console.log(x)
};