import { createStore, combineReducers, applyMiddleware } from "redux";
import stocks from "./stocksReducer";
import orders from "./ordersReducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga";
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({stocks, orders}),
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);

export default store;
export { getStocks, changeStocks } from "./stocksReducer";
