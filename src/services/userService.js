
import axios from "axios";
import { BASE_URL } from "../constants";

export const login = async (postData) => {
  console.log("Invoke Here");
  console.log(postData);
  var x = await axios({
    method: "post",
    url: BASE_URL + "/taiKhoan/login",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    data: {
      "tenDangNhap": "DarkWalker",
      "matKhau": "123456"
    },
  });
  console.log(x)
  return x.data;
};
