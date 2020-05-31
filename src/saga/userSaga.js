import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { login ,getInfo,getDanhMuc} from "../services/userService";

export function* loginSaga(action) {
  try {
    const result = yield call(login, action.payload);
    if (result.status == "OK") {
      console.log(result.data.username);
      console.log(result.data.id);
      yield put({
        type: "LOGIN_SUCCESS",
        payload: result,
      });
    }
    else if (result.status == "FAIL"){
      yield put({
        type: "LOGIN_FAIL",
        payload: result.message,
      })
    }
  } catch (err) {
    yield put({
      type: "LOGIN_FAIL",
      payload: err,
    });
  }
}

export function* getDanhMucSaga(action) {
  try {
    const result = yield call(getDanhMuc, action);
    if (result.status == "OK") {
      yield put({
        type: "DANH_MUC_SUCCESS",
        payload: result,
      });
    }
    else if (result.status == "FAIL"){
      yield put({
        type: "DANH_MUC_SUCCESS",
        payload: { data : {}},
      });
    }
  } catch (err) {
    yield put({
      type: "DANH_MUC_SUCCESS",
      payload: { data : {err:err}},
    });
  }
}

export function* getInfoSaga(action) {
  try {
    const result = yield call(getInfo, action);
    if (result.status == "OK") {
      yield put({
        type: "THONG_TIN_SUCCESS",
        payload: result,
      });
    }
    else if (result.status == "FAIL"){
      yield put({
        type: "THONG_TIN_SUCCESS",
        payload: { data : {}},
      });
    }
  } catch (err) {
    yield put({
      type: "THONG_TIN_SUCCESS",
      payload: { data : {err:err}},
    });
  }
}