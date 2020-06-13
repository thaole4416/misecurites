import { call, put } from "redux-saga/effects";
import { order , edit, cancel } from "../services/stocksService";
import { emitter } from "../emitter";

export function* orderSaga(action) {
  try {
    const result = yield call(order, action);
    if (result.status == "OK") {
      emitter.emit("orderSuccess")
      yield put({
        type: "ORDER_SUCCESS",
        payload: result,
      });
    }
    else if (result.status == "FAIL"){
      emitter.emit("orderFail",result.message)
      yield put({
        type: "ORDER_FAIL",
        payload: result.message,
      })
    }
  } catch (err) {
    emitter.emit("orderSuccess","Lỗi đặt lệnh")
    yield put({
      type: "ORDER_FAIL",
      payload: err,
    });
  }
}

export function* editOrderSaga(action) {
  try {
    const result = yield call(edit, action);
    if (result.status == "OK") {
      emitter.emit("editSuccess")
    } else if (result.status == "FAIL") {
      emitter.emit("edtiFail", result.message)
    }
  } catch (err) {
    emitter.emit("editFail","Lỗi sửa lệnh")
  }
}
export function* cancelOrderSaga(action) {
  try {
    const result = yield call(cancel, action);
    if (result.status == "OK") {
      emitter.emit("cancelSuccess")
    } else if (result.status == "FAIL") {
      emitter.emit("cancelFail",result.message)
    }
  } catch (err) {
    emitter.emit("cancelFail","Lỗi hủy lệnh")
  }
}