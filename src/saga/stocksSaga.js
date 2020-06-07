import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  getExcsList,
  getAllStocks,
  getHistory,
} from "../services/stocksService";

export function* getExc(action) {
  const data = yield call(getExcsList);
  console.log(data);
}

export function* getAllStocksSaga(action) {
  try {
    const response = yield call(getAllStocks);
    let result = response.data;
    if (result.status == "OK") {
      yield put({
        type: "GET_ALL_STOCKS_SUCCESS",
        payload: result.data,
      });
    } else if (result.status == "FAIL") {
      yield put({
        type: "GET_ALL_STOCKS_FAIL",
        payload: result.message,
      });
    }
  } catch (err) {
    yield put({
      type: "GET_ALL_STOCKS_FAIL",
      payload: err,
    });
  }
}

export function* getHistorySaga(action) {
  try {
    const result = yield call(getHistory, action);
    if (result.status == "OK") {
      yield put({
        type: "LICH_SU_SUCCESS",
        payload: result.data,
      });
    } else if (result.status == "FAIL") {
      yield put({
        type: "LICH_SU_SUCCESS",
        payload:  [] ,
      });
    }
  } catch (err) {
    yield put({
      type: "LICH_SU_SUCCESS",
      payload:   { err: err } ,
    });
  }
}
