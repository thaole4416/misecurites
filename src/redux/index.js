import { createStore, combineReducers, applyMiddleware } from "redux";
import stocks from "./stocksReducer";
import orders from "./ordersReducer";
import user from "./userReducer";
import otp from "./otpReducer";
import allStocks from "./allStocksReducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga";
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({ stocks, orders, user, allStocks, otp }),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

export default store;
export { setStocks, changeStocks } from "./stocksReducer";
export { getAllStocks } from "./allStocksReducer";
export { login, loginSuccess, loginFail, logout } from "./userReducer";
export { order, orderSuccess } from "./ordersReducer";
export { genOtp, verifyOtp } from "./otpReducer";
