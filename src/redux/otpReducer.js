const actionTypes = {
  GEN_OTP: "GEN_OTP",
  GEN_OTP_SUCCESS: "GEN_OTP_SUCCESS",
  VERIFY_OTP: "VERIFY_OTP",
  VERIFY_OTP_SUCCESS: "VERIFY_OTP_SUCCESS",
};

export const genOtp = (token) => ({
  type: actionTypes.GEN_OTP,
  payload: token,
});

export const genOtpSuccess = () => ({
  type: actionTypes.GEN_OTP_SUCCESS,
});

/**
 *
 * @param {Object} payload token &&  otpCode
 */
export const verifyOtp = (payload) => ({
  type: actionTypes.VERIFY_OTP,
  payload: payload,
});

export const verifyOtpSuccess = () => ({
  type: actionTypes.VERIFY_OTP_SUCCESS,
});

const otp = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.GEN_OTP_SUCCESS:
      state = action.payload;
      return { ...state };
    case actionTypes.VERIFY_OTP_SUCCESS:
      state = action.payload;
      return { ...state };
    default:
      return state;
  }
};

export default otp;
