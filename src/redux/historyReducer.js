let data = []
const actionTypes = {
  LICH_SU: "LICH_SU",
  LICH_SU_SUCCESS: "LICH_SU_SUCCESS",
};


export const getHistory = (payload) => ({
  type: actionTypes.LICH_SU,
  payload: payload,
});
export const getHistorySuccess = (payload) => ({
  type: actionTypes.LICH_SU_SUCCESS,
  payload: payload,
});

const hitory = (state = data, action) => {
  switch (action.type) {
    case actionTypes.LICH_SU_SUCCESS:
      state = action.payload;
      return [...state];
    default:
      return state;
  }
};

export default hitory;
