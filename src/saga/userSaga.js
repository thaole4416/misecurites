import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { login } from "../services/userService";
import { loginSuccess, loginFail } from "../redux";

export function* loginSaga(action) {
  try {
    const data = yield call(login, action.payload);
    if (data.message == "OK") {
      console.log(data.username);
      console.log(data.id);
      yield put({
        type: "LOGIN_SUCCESS",
        payload: { name: data.username, id: data.id },
      });
    }
  } catch {
    yield put(loginFail());
  }
}
