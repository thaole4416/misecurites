import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { changeStocks, login } from "../redux"
import { getExc } from "./stocksSaga";
import { loginSaga } from "./userSaga";
function* fetchUser(action) {
//    try {
//       const user = yield call(Api.fetchUser, action.payload.userId);
//       yield put({type: "USER_FETCH_SUCCEEDED", user: user});
//    } catch (e) {
//       yield put({type: "USER_FETCH_FAILED", message: e.message});
//    }
    alert('Hi')
}

function* rootSaga() {
  // yield takeEvery(changeStocks, getExc);
  yield takeEvery("LOGIN", loginSaga);
}

export default rootSaga;