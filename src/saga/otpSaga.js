import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { genOtp, verifyOtp } from "../services/otpService";
import { emitter } from "../emitter";

export function* genOtpSaga(action) {
  console.log("ahihi");
  try {
    const result = yield call(genOtp, action);
    if (result.status == "OK") {
      yield put({
        type: "GEN_OTP_SUCCESS",
        payload: result,
      });
    } else if (result.status == "FAIL") {
      yield put({
        type: "GEN_OTP_SUCCESS",
        payload: result,
      });
    }
  } catch (err) {
    yield put({
      type: "GEN_OTP_SUCCESS",
      payload: err,
    });
  }
}

export function* verifyOtpSaga(action) {
  try {
    const result = yield call(verifyOtp, action);
    if (result.status == "OK") {
      emitter.emit("verifySuccess");
      yield put({
        type: "VERIFY_OTP_SUCCESS",
        payload: result,
      });
    } else if (result.status == "FAIL") {
      yield put({
        type: "VERIFY_OTP_SUCCESS",
        payload: result,
      });
    }
  } catch (err) {
    yield put({
      type: "VERIFY_OTP_SUCCESS",
      payload: err,
    });
  }
}
