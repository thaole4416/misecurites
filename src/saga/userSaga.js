import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { login } from "../services/userService";
import { loginSuccess, loginFail } from "../redux";

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
