const actionTypes = {
  CHANG_EXCHANGE: "CHANG_EXCHANGE",
};

export const changeExchange = (exchange) => ({
  type: actionTypes.CHANG_EXCHANGE,
  payload: exchange
});



const exchange = (state , action) => {
  switch (action.type) {
    case actionTypes.CHANG_EXCHANGE: 
      return action.payload
    default:
      return state || localStorage.getItem("activeExchange");
  }
};

export default exchange;
