import { createStore, combineReducers, applyMiddleware } from "redux";
import stocks from "./stocksReducer";
import orders from "./ordersReducer";
import user from "./userReducer";
import otp from "./otpReducer";
import allStocks from "./allStocksReducer";
import exchange from "./exchangeReducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga";
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({ stocks, orders, user, allStocks, otp,exchange}),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

export default store;
export { setStocks, changeStocks , getHistory } from "./stocksReducer";
export { getAllStocks } from "./allStocksReducer";
export { login, loginSuccess, loginFail, logout , getDanhMuc ,getThongTin } from "./userReducer";
export { order, orderSuccess } from "./ordersReducer";
export { genOtp, verifyOtp } from "./otpReducer";
export { changeExchange } from "./exchangeReducer";
