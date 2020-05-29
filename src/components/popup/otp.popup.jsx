import React, { Component } from "react";
import SkyLight from "react-skylight";

class OtpPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otpCode: "",
    };
  }

  handChange = (event) => {
    this.setState({ otpCode: event.target.value });
  };

  render() {
    const { otpCode } = this.state;
    return (
      <div className="otp-form">
        <form>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập mã OTP"
              required="required"
              value={otpCode}
              onChange={this.handChange}
            />
            {this.props.otp.status == "FAIL" ? (
              <div className="bg-danger text-white p-2">
                {this.props.status}
              </div>
            ) : null}
          </div>
          <div className="form-group">
            <button
              onClick={(e) => this.props.verifyOtp(this.state.otpCode, e)}
              className="button btn btn-block"
            >
              Xác nhận
            </button>
          </div>
          <div className="clearfix"></div>
        </form>
        <p className="text-center">
          <a href="javascipt:void(0)" onClick={this.props.reSendOtp}>
            Gửi lại mã OTP
          </a>
        </p>
      </div>
    );
  }
}

export default OtpPopup;
