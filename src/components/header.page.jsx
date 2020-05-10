import React, { Component } from "react";
import LoginPopup from "./popup/login.popup";
import RegisterPopup from "./popup/register.popup";
import SkyLight from "react-skylight";
import { login, logout } from "../redux";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import logo from "../img/logo.png";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showUserMenu: false,
    };
  }

  register = () => {
    this.loginPopup.hide();
    this.registerPopup.show();
  };

  submitLogin = (loginPostData, e) => {
    e.preventDefault();
    this.props.login(loginPostData);
    toast.success("Đăng nhập thành công");
    this.loginPopup.hide();
  };

  handleShowUserMenu = () => {
    this.setState({ showUserMenu: !this.state.showUserMenu });
  };

  handleShowInfo = () => {};

  handleShowChangePassword = () => {};

  handleMouseLeave = () => {
    setTimeout(() => this.setState({ showUserMenu: false }),500)
  };

  handleLogout = () => {
    this.props.logout();
    this.setState({ showUserMenu: false });
    toast.success("Đăng xuất thành công");
  };
  render() {
    let loginPopupStyle = {
      backgroundColor: "rgb(33,32,39)",
      width: "30%",
      marginLeft: "-35%",
      left: "70%",
    };
    let registerPopupStyle = {
      backgroundColor: "rgb(33,32,39)",
      width: "70%",
      marginLeft: "-15%",
      left: "30%",
    };
    const user =
      this.props.user && this.props.user.username
        ? this.props.user
        : JSON.parse(localStorage.getItem("userInfo"));
    return (
      <div className="header">
        <img src={logo} alt="" />
        <div className="login div">
          {user && user.username ? (
            <div>
              <span>{user.username} &nbsp;&nbsp;&nbsp;</span>
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
          dialogStyles={registerPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.registerPopup = ref)}
          title="Đăng ký tài khoản"
        >
          <RegisterPopup />
        </SkyLight>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user: user,
});
const mapDispatchToProps = (dispatch) => ({
  login: (postData) => {
    dispatch(login(postData));
  },
  logout: () => {
    dispatch(logout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
