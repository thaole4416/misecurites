let data = [];

const actionTypes = {
  GET_ALL_STOCKS: "GET_ALL_STOCKS",
  GET_ALL_STOCKS_SUCCESS: "GET_ALL_STOCKS_SUCCESS"
};

export const getAllStocks = () => ({
  type: actionTypes.GET_ALL_STOCKS,
});

export const getAllStocksSuccess = (payload) => ({
  type: actionTypes.GET_ALL_STOCKS_SUCCESS,
  payload: payload,
});

const allStocks = (state = data, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_STOCKS_SUCCESS: 
      return [...action.payload]
    default:
      return state;
  }
};

export default allStocks;
