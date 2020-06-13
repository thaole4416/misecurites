let data = [
  {
    ceiling: 26600,
    floor: 23200,
    reference: 24500,
    symbol: "CNG",
    top1Khop: [],
    top3Ban: [],
    top3Mua: [],
  },
];

const actionTypes = {
  CHANGE_STOCKS: "CHANGE_STOCKS",
  SET_STOCKS: "SET_STOCKS",
  SET_STOCK: "SET_STOCK",
  LICH_SU: "LICH_SU",
  LICH_SU_SUCCESS: "LICH_SU_SUCCESS",
};

export const changeStocks = () => ({
  type: actionTypes.CHANGE_STOCKS,
});

export const setStocks = (stocksData) => ({
  type: actionTypes.SET_STOCKS,
  payload: stocksData,
});
export const setStock = (stockData) => ({
  type: actionTypes.SET_STOCK,
  payload: stockData,
});

export const getHistory = (payload) => ({
  type: actionTypes.LICH_SU,
  payload: payload,
});
export const getHistorySuccess = (payload) => ({
  type: actionTypes.LICH_SU_SUCCESS,
  payload: payload,
});

const stocks = (state = data, action) => {
  switch (action.type) {
    case actionTypes.SET_STOCKS:
      state = action.payload;
      return [...state];
    case actionTypes.SET_STOCK:
      state[state.findIndex(x => x.symbol == action.payload.symbol)] = action.payload
      return [...state];
    case actionTypes.CHANGE_STOCKS:
      state[0].buy_2 = state[0].buy_2 + 1000;
      return [...state];
    default:
      return state;
  }
};

export default stocks;
