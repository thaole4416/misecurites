const actionTypes = {
  ORDER: "ORDER",
  ORDER_SUCCESS: "ORDER_SUCCESS",
};

export const order = (payload) => ({
  type: actionTypes.ORDER,
  payload: payload
});

export const orderSuccess = (payload) => ({
  type: actionTypes.ORDER_SUCCESS,
  payload: payload,
});

const orders = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.ORDER_SUCCESS:
    default:
      return state;
  }
};

export default orders;
