import React, { Component } from "react";
import LoginPopup from "./popup/login.popup";
import RegisterPopup from "./popup/register.popup";
import InfoPopup from "./popup/info.popup";
import ChangePasswordPopup from "./popup/passwordChange.popup";
import axios from "axios";
import { BASE_URL } from "../constants";
import SkyLight from "react-skylight";
import {
  login,
  logout,
  getAllStocks,
  getThongTin,
  getDanhMuc,
  register,
  verifyOtp,
  genOtp,
  changePassword,
} from "../redux";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import logo from "../img/logo.png";
import Clock from "./clock";
import { getCookie } from "../helpers/cookies";
import { emitter } from "../emitter";
import OtpPopup from "./popup/otp.popup";
import Draggable from "react-draggable";
class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDrags: 0,
      showUserMenu: false,
      showDemo: false,
      registerErrors: [],
      password: {},
    };
  }

  register = () => {
    this.loginPopup.hide();
    this.registerPopup.show();
  };

  listenEvent = () => {
    emitter.on("loginSuccess", () => {
      toast.success("Đăng nhập thành công");
      this.props.getThongTin(this.props.user.token);
      this.props.getDanhMuc(this.props.user.token);
    });
    emitter.on("loginFail", () => toast.error("Đăng nhập thất bại"));
    emitter.on("registerSuccess", () => {
      this.registerPopup.hide();
      toast.success("Đăng ký thành công");
    });
    emitter.on("registerFail", (errors) => {
      this.setState({ registerErrors: errors });
      toast.error("Đăng ký thất bại");
    });
    emitter.on(`verifySuccess1`, () => {
      this.props.changePassword({
        token: this.props.user.token,
        password: this.state.password.password,
        newPassword: this.state.password.newPassword,
      });
    });
    emitter.on(`changePasswordSuccess`, () => {
      toast.success("Đổi mật khẩu thành công");
    });
    emitter.on(`changePasswordFail`, (message) => {
      toast.error(message);
    });
  };

  submitLogin = (loginPostData, e) => {
    e.preventDefault();
    this.props.login(loginPostData);
    this.loginPopup.hide();
  };

  submitRegister = (loginPostData, e) => {
    e.preventDefault();
    this.props.register(loginPostData);
    this.loginPopup.hide();
  };

  handleShowUserMenu = () => {
    this.setState({ showUserMenu: !this.state.showUserMenu });
  };

  handleShowInfo = () => {
    this.setState({ showUserMenu: !this.state.showUserMenu });
    this.infoPopup.show();
  };

  handleShowChangePassword = () => {
    this.setState({ showUserMenu: !this.state.showUserMenu });
    this.changePasswordPopup.show();
  };

  handleMouseLeave = () => {
    setTimeout(() => this.setState({ showUserMenu: false }), 500);
  };

  handleLogout = () => {
    this.props.logout();
    this.setState({ showUserMenu: false });
    toast.success("Đăng xuất thành công");
  };

  verifyOtp = (otpCode, event) => {
    event.preventDefault();
    // emitter.emit(`verifySuccess1`);
    this.props.verifyOtp({ otpCode: otpCode, token: this.props.user.token });
  };

  async componentDidMount() {
    this.listenEvent();
    this.props.getAllStocks();
    if (this.props.user || getCookie("userInfo")) {
      this.props.getThongTin(this.props.user.token);
      this.props.getDanhMuc(this.props.user.token);
    }
    let result = await axios({
      method: "get",
      url: BASE_URL + "/demo/phien",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    window.phien = result.data;
    this.setState({ phien: result.data });
  }

  setPhien = async (phien) => {
    this.setState({ phien: phien });
    await axios({
      method: "post",
      url: BASE_URL + "/demo/phien",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      data: {
        phien: phien,
      },
    });
    window.phien = phien;
  };

  initData = async () => {
    await axios({
      method: "get",
      url: BASE_URL + "/demo/init",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  };

  end = async () => {
    await axios({
      method: "get",
      url: BASE_URL + "/demo/end",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  };
  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };

  showDemo = () => {
    if (this.props.user.id && this.props.user.id == "29A000003")
      this.setState({ showDemo: !this.state.showDemo });
  };

  checkOtpCode = (password) => {
    this.otpPopup1.show();
    this.props.genOtp(this.props.user.token);
    this.setState({ password });
  };

  render() {
    let loginPopupStyle = {
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      width: "30%",
      marginLeft: "-35%",
      left: "70%",
      minHeight: "300px",
    };
    let otpPopup1Style = {
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      width: "30%",
      marginLeft: "-35%",
      left: "70%",
    };
    let registerPopupStyle = {
      maxHeight: "500px",
      overflowY: "auto",
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      width: "70%",
      marginLeft: "-15%",
      left: "30%",
    };
    let changePasswordPopupStyle = {
      width: "25%",
      minHeight: "400px",
      position: "fixed",
      top: "150px",
      marginTop: "-0",
      left: "100%",
      height: "100%",
      marginLeft: "-25%",
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      font: "roboto",
      fontSize: "1rem",
      padding: 0,
    };
    let infoPopuppStyle = {
      width: "25%",
      minHeight: "400px",
      position: "fixed",
      top: "150px",
      marginTop: "-0",
      left: "100%",
      height: "100%",
      marginLeft: "-25%",
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      font: "roboto",
      fontSize: "1rem",
      padding: 0,
    };
    const user =
      this.props.user && this.props.user.username
        ? this.props.user
        : getCookie("userInfo");
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    return (
      <div className="header">
        <img src={logo} alt="" />
        <Clock />
        <div className="login div">
          {user && user.username ? (
            <div>
              <span
                onClick={this.handleShowUserMenu}
                style={{ cursor: "pointer" }}
              >
                {user.username} &nbsp;&nbsp;&nbsp;
              </span>
              <div className="userMenu">
                <a
                  href="javascript:void(0);"
                  className={
                    this.state.showUserMenu
                      ? "fa fa-caret-up"
                      : "fa fa-caret-down"
                  }
                  onClick={this.handleShowUserMenu}
                ></a>
                <div
                  class="userMenu--dropdown"
                  style={{
                    display: this.state.showUserMenu ? "block" : "none",
                  }}
                  onMouseLeave={this.handleMouseLeave}
                >
                  <span
                    className="userMenu--dropdown__item"
                    onClick={this.handleShowInfo}
                  >
                    Thông tin
                  </span>
                  <span
                    className="userMenu--dropdown__item"
                    onClick={this.handleShowChangePassword}
                  >
                    Đổi mật khẩu
                  </span>
                  <span
                    className="userMenu--dropdown__item"
                    onClick={this.handleLogout}
                  >
                    Đăng xuất
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <a
              href="javascript:void(0);"
              onClick={() => this.loginPopup.show()}
            >
              <span className="glyphicon glyphicon-log-in"></span>
              Đăng nhập
            </a>
          )}
        </div>
        <div className="flag">
          <span className="vi" />
        </div>

        <SkyLight
          dialogStyles={loginPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.loginPopup = ref)}
          title="Đăng nhập hệ thống"
        >
          <LoginPopup register={this.register} submit={this.submitLogin} />
        </SkyLight>
        <SkyLight
          dialogStyles={otpPopup1Style}
          hideOnOverlayClicked
          ref={(ref) => (this.otpPopup1 = ref)}
          title="Check mã OTP"
        >
          <OtpPopup
            verifyOtp={this.verifyOtp}
            reSendOtp={this.reSendOtp}
            otp={this.props.otp}
          />
        </SkyLight>
        <SkyLight
          dialogStyles={registerPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.registerPopup = ref)}
          title="Đăng ký tài khoản"
        >
          <RegisterPopup
            submit={this.submitRegister}
            errors={this.state.registerErrors}
          />
        </SkyLight>
        <SkyLight
          dialogStyles={changePasswordPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.changePasswordPopup = ref)}
          title="Đổi mật khẩu"
        >
          <ChangePasswordPopup callback={this.checkOtpCode} />
        </SkyLight>
        <SkyLight
          dialogStyles={infoPopuppStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.infoPopup = ref)}
          title="Thông tin tài khoản"
        >
          <InfoPopup info={this.props.user.info} />
        </SkyLight>
        {this.props.user.id && this.props.user.id == "29A000003" && (
          <Draggable handle="button" {...dragHandlers}>
            <button className="draggable" onDoubleClick={this.showDemo}>
              <div className="draggableText">+</div>
              {this.state.showDemo && (
                <div className="userMenu">
                  <div
                    class="userMenu--dropdown"
                    style={{
                      display: "block",
                      left: "15px",
                    }}
                  >
                    <div className="p-1">
                      Phiên:{" "}
                      {this.state.phien === 1
                          ?  "định kỳ"
                        : this.state.phien === 3 ?
                        "liên tục"
                        : ""}
                    </div>
                    <hr />
                    <span
                      className="userMenu--dropdown__item"
                      onClick={() => this.setPhien(1)}
                    >
                      Set phiên định kỳ mở
                    </span>
                    <span
                      className="userMenu--dropdown__item"
                      onClick={() => this.setPhien(3)}
                    >
                      Set phiên liên tục
                    </span>
                    <span
                      className="userMenu--dropdown__item"
                      onClick={() => this.initData()}
                    >
                      Tạo dữ liệu
                    </span>
                  </div>
                </div>
              )}
            </button>
          </Draggable>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ user, otp }) => ({
  user: user,
  otp: otp,
});
const mapDispatchToProps = (dispatch) => ({
  login: (postData) => {
    dispatch(login(postData));
  },
  register: (postData) => {
    dispatch(register(postData));
  },
  logout: () => {
    dispatch(logout());
  },
  getAllStocks: () => {
    dispatch(getAllStocks());
  },
  getThongTin: (payload) => {
    dispatch(getThongTin(payload));
  },
  getDanhMuc: (payload) => {
    dispatch(getDanhMuc(payload));
  },
  genOtp: (payload) => dispatch(genOtp(payload)),
  verifyOtp: (payload) => dispatch(verifyOtp(payload)),
  changePassword: (payload) => dispatch(changePassword(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
