import React, { Component } from "react";
import LoginPopup from "./popup/login.popup";
import RegisterPopup from "./popup/register.popup";
import SkyLight from "react-skylight";
import { login } from "../redux";
import { connect } from "react-redux";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  register = () => {
    this.loginPopup.hide();
    this.registerPopup.show();
  };

  submitLogin = (loginPostData, e) => {
    e.preventDefault();
    this.props.login(loginPostData)
    this.loginPopup.hide();
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
    const user = this.props.user && this.props.user.username ? this.props.user : JSON.parse(localStorage.getItem("userInfo"))
    return (
      <div className="header">
        <div className="login div">
          {user && user.username ? user.username : <a href="javascipt:void(0)" onClick={() => this.loginPopup.show()}>
            <span className="glyphicon glyphicon-log-in"></span>
            Đăng nhập
          </a>}
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

const mapStateToProps = ({user}) => ({
  user : user
});
const mapDispatchToProps = (dispatch) => ({
  login: (postData) => {
    dispatch(login(postData));
  },
});

export default connect(mapStateToProps,mapDispatchToProps)(Header);
