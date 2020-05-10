import { createStore, combineReducers, applyMiddleware } from "redux";
import stocks from "./stocksReducer";
import orders from "./ordersReducer";
import user from "./userReducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga";
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({stocks, orders,user}),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

export default store;
export { setStocks, changeStocks } from "./stocksReducer";
export { login, loginSuccess, loginFail , logout } from "./userReducer";
