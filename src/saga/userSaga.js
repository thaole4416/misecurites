import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { login, getInfo, getDanhMuc, register, changePassword } from "../services/userService";
import { emitter } from "../emitter";

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
      emitter.emit("loginSuccess");
    } else if (result.status == "FAIL") {
      yield put({
        type: "LOGIN_FAIL",
        payload: result.message,
      });
      emitter.emit("loginFail");
    }
  } catch (err) {
    yield put({
      type: "LOGIN_FAIL",
      payload: err,
    });
    emitter.emit("loginFail");
  }
}

export function* registerSaga(action) {
  try {
    const result = yield call(register, action);
    if (result.status == "OK") {
      emitter.emit("registerSuccess");
      console.log("ok");
    } else if (result.status == "FAIL") {
      emitter.emit("registerFail", result.message);
      console.log("fail");
    }
  } catch (err) {
    emitter.emit("registerFail", [err]);
  }
}

export function* changePasswordSaga(action) {
  try {
    const result = yield call(changePassword, action);
    if (result.status == "OK") {
      emitter.emit("changePasswordSuccess");
      console.log("ok");
    } else if (result.status == "FAIL") {
      emitter.emit("changePasswordFail", result.message);
      console.log("fail");
    }
  } catch (err) {
    emitter.emit("changePasswordFail", [err]);
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
    } else if (result.status == "FAIL") {
      yield put({
        type: "DANH_MUC_SUCCESS",
        payload: { data: [] },
      });
    }
  } catch (err) {
    yield put({
      type: "DANH_MUC_SUCCESS",
      payload: { data: [] },
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
    } else if (result.status == "FAIL") {
      yield put({
        type: "THONG_TIN_SUCCESS",
        payload: { data: {} },
      });
    }
  } catch (err) {
    yield put({
      type: "THONG_TIN_SUCCESS",
      payload: { data: { err: err } },
    });
  }
}
