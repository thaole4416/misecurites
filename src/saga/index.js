import { takeEvery } from "redux-saga/effects";
import {  getAllStocksSaga } from "./stocksSaga";
import { loginSaga } from "./userSaga";
import { orderSaga } from "./orderSaga";
import { genOtpSaga, verifyOtpSaga } from "./otpSaga";

function* rootSaga() {
  yield takeEvery("LOGIN", loginSaga);
  yield takeEvery("GET_ALL_STOCKS", getAllStocksSaga);
  yield takeEvery("ORDER", orderSaga);
  yield takeEvery("GEN_OTP", genOtpSaga);
  yield takeEvery("VERIFY_OTP", verifyOtpSaga);
}

export default rootSaga;
