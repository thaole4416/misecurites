import { takeEvery } from "redux-saga/effects";
import { getAllStocksSaga, getHistorySaga } from "./stocksSaga";
import { loginSaga, getDanhMucSaga, getInfoSaga, registerSaga,changePasswordSaga } from "./userSaga";
import { orderSaga } from "./orderSaga";
import { genOtpSaga, verifyOtpSaga } from "./otpSaga";

function* rootSaga() {
  yield takeEvery("LOGIN", loginSaga);
  yield takeEvery("REGISTER", registerSaga);
  yield takeEvery("GET_ALL_STOCKS", getAllStocksSaga);
  yield takeEvery("ORDER", orderSaga);
  yield takeEvery("GEN_OTP", genOtpSaga);
  yield takeEvery("VERIFY_OTP", verifyOtpSaga);
  yield takeEvery("DANH_MUC", getDanhMucSaga);
  yield takeEvery("LICH_SU", getHistorySaga);
  yield takeEvery("THONG_TIN", getInfoSaga);
  yield takeEvery("CHANGE_PASSWORD", changePasswordSaga);
}

export default rootSaga;
