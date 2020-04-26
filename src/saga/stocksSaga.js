import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { getExcsList } from "../services/stocksService";

export function* getExc(action) {
    const data = yield call(getExcsList);
    console.log(data)
}
