import React, { Component } from "react";
import SkyLight from "react-skylight";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let loginPopupStyle = {
      backgroundColor: "292929",
      width: "30%",
      marginLeft: "-35%",
      left: "70%",
    };
    let registerPopupStyle = {};
    let loginPopup = (
      <div className="login-form">
        <form action="/examples/actions/confirmation.php" method="post">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tên đăng nhập"
              required="required"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              required="required"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Đăng nhập
            </button>
          </div>
          <div className="clearfix"></div>
        </form>
        <p className="text-center">
          <a
            href="javascipt:void(0)"
            onClick={() => {
              this.loginPopup.hide();
              this.registerPopup.show();
            }}
          >
            Đăng ký tài khoản
          </a>
        </p>
      </div>
    );
    let registerPopup = (
      <form action="/examples/actions/confirmation.php" method="post">
        <h2>Sign Up</h2>
        <p>Please fill in this form to create an account!</p>
        <hr />
        <div className="form-group">
          <div className="row">
            <div className="col-xs-6">
              <input
                type="text"
                className="form-control"
                name="first_name"
                placeholder="First Name"
                required="required"
              />
            </div>
            <div className="col-xs-6">
              <input
                type="text"
                className="form-control"
                name="last_name"
                placeholder="Last Name"
                required="required"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Email"
            required="required"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            required="required"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            name="confirm_password"
            placeholder="Confirm Password"
            required="required"
          />
        </div>
        <div className="form-group">
          <label className="checkbox-inline">
            <input type="checkbox" required="required" /> I accept the{" "}
            <a href="javascipt:void(0)">Terms of Use</a> &amp; <a href="javascipt:void(0)">Privacy Policy</a>
          </label>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-lg">
            Sign Up
          </button>
        </div>
      </form>
    );
    return (
      <div className="header">
        <div className="login div">
          <a href="javascipt:void(0)" onClick={() => this.loginPopup.show()}>
            <span className="glyphicon glyphicon-log-in"></span>
            Đăng nhập
          </a>
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
          {loginPopup}
        </SkyLight>
        <SkyLight
          dialogStyles={registerPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.registerPopup = ref)}
          title="Đăng ký tài khoản"
        >
          {registerPopup}
        </SkyLight>
      </div>
    );
  }
}

export default Header;
