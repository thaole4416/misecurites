import { call, put } from "redux-saga/effects";
import { order } from "../services/stocksService";

export function* orderSaga(action) {
  try {
    const result = yield call(order, action);
    if (result.status == "OK") {
      yield put({
        type: "ORDER_SUCCESS",
        payload: result,
      });
    }
    else if (result.status == "FAIL"){
      yield put({
        type: "ORDER_FAIL",
        payload: result.message,
      })
    }
  } catch (err) {
    yield put({
      type: "ORDER_FAIL",
      payload: err,
    });
  }
}
