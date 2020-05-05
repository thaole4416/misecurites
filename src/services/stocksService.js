import axios from "axios";
import { BASE_URL } from "../constants";
axios.defaults.baseURL = 'localhost:3000';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
export const getExcsList = async () => {
  console.log("gọi api");
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