import { setCookie, getCookie, deleteCookie } from "../helpers/cookies";
import { act } from "react-dom/test-utils";
const actionTypes = {
  LOGIN: "LOGIN",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAIL: "LOGIN_FAIL",
  DANH_MUC: "DANH_MUC",
  DANH_MUC_SUCCESS: "DANH_MUC_SUCCESS",
  THONG_TIN: "THONG_TIN",
  THONG_TIN_SUCCESS: "THONG_TIN_SUCCESS",
  LOGOUT: "LOGOUT",
};

export const login = (data) => ({
  type: actionTypes.LOGIN,
  payload: data,
});

export const loginSuccess = (payload) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: payload,
});

export const loginFail = (err) => ({
  type: actionTypes.LOGIN_FAIL,
  payload: err,
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});

export const getDanhMuc = (payload) => ({
  type: actionTypes.DANH_MUC,
  payload: payload,
});

export const getDanhMucSuccess = (payload) => ({
  type: actionTypes.DANH_MUC_SUCCESS,
  payload: payload,
});

export const getThongTin = (payload) => ({
  type: actionTypes.THONG_TIN,
  payload: payload,
});

export const getThongTinSuccess = (payload) => ({
  type: actionTypes.THONG_TIN_SUCCESS,
  payload: payload,
});

const initialState = getCookie("userInfo") || {
  username: "",
  id: "",
  message: "",
  token: "",
  refreshToken: "",
};

const user = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      state = {
        username: action.payload.data.username,
        id: action.payload.data.id,
        message: action.payload.message,
        token: action.payload.data.token,
        refreshToken: action.payload.data.refreshToken,
      };
      setCookie("userInfo", state, 60 * 60);
      return { ...state };
    case actionTypes.DANH_MUC_SUCCESS:
      return { ...state, danhMuc: action.payload.data  };
    case actionTypes.THONG_TIN_SUCCESS:
      return { ...state, info: action.payload.data, soDu: action.payload.data.soDu};
    case actionTypes.LOGIN_FAIL:
      state = { ...state, username: "", id: "", message: action.payload };
      return { ...state };
    case actionTypes.LOGOUT:
      deleteCookie("userInfo");
      return { ...initialState };
    default:
      return state || initialState;
  }
};

export default user;
