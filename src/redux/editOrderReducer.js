let data = [];
const actionTypes = {
  EDIT: "EDIT",
  CANCEL: "CANCEL",
  CHECK_EDIT: "CHECK_EDIT",
  CHECK_CANCEL_EDIT: "CHECK_CANCEL_EDIT",
};

export const checkEdit = (payload) => ({
  type: actionTypes.CHECK_EDIT,
  payload: payload,
});

export const edit = (payload) => ({
  type: actionTypes.EDIT,
  payload: payload,
});
export const cancel = (payload) => ({
  type: actionTypes.CANCEL,
  payload: payload,
});

const editOrder = (
  state = {
    gia: 0,
    khoiLuong: 0,
    loaiLenh: "",
    maLenh: "",
    maCoPhieu: "",
    giaSua: 0,
    khoiLuongSua: 0,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.CHECK_EDIT:
      return { ...state, ...action.payload };
    case actionTypes.CHECK_CANCEL_EDIT:
      return {
        ...state,
        gia: 0,
        khoiLuong: 0,
        loaiLenh: "",
        maLenh: "",
        maCoPhieu: "",
        giaSua: 0,
        khoiLuongSua: 0,
      };
    default:
      return state;
  }
};

export default editOrder;
