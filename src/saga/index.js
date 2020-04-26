import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { getExc } from "./stocksSaga";
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
  yield takeEvery("CHANGE_STOCKS", getExc);
}

export default rootSaga;