const actionTypes = {
    LOGIN: "LOGIN",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL"
  };
  
  export const login = (credential) => ({
    type: actionTypes.LOGIN,
    payload: credential
  });
  
  export const loginSuccess = (credential) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: credential,
  });

  export const loginFail = () => ({
    type: actionTypes.LOGIN_FAIL,
  });
  
  const user = (state = {name: "", id: ""}, action) => {
    switch (action.type) {
      case actionTypes.LOGIN_SUCCESS:
        return {...action.payload}
      case actionTypes.LOGIN_FAIL:
       return {...state}
      default:
        return state;
    }
  };
  
  export default user;
  