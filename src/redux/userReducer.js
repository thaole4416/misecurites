const actionTypes = {
  LOGIN: "LOGIN",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAIL: "LOGIN_FAIL",
};

export const login = (data) => ({
  type: actionTypes.LOGIN,
  payload: data,
});

export const loginSuccess = (payload) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: payload,
});

export const loginFail = (err) => ({
  type: actionTypes.LOGIN_FAIL,
  payload: err,
});

const initialState = {
  username: "",
  id: "",
  message: "",
  token: "",
  refreshToken: "",
};

const user = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      state = {
        username: action.payload.data.username,
        id: action.payload.data.id,
        message: action.payload.message,
        token: action.payload.data.token,
        refreshToken: action.payload.data.refreshToken
      };
      localStorage.setItem("userInfo",JSON.stringify(state))
      return { ...state };
    case actionTypes.LOGIN_FAIL:
      state = { ...state, username: "", id: "", message: action.payload };
      return { ...state };
    default:
      return state || initialState;
  }
};

export default user;
