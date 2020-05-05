import React, { Component } from "react";

class LoginPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginData: {
        username: "",
        password: "",
      },
    };
  }

  handleChangeUsername = (event) => {
    this.state.loginData.username = event.target.value;
    this.setState({ ...this.state });
  };

  handleChangePassword = (event) => {
    this.state.loginData.password = event.target.value;
    this.setState({ ...this.state });
  };

  render() {
    let { username, password } = this.state.loginData;
    return (
      <div className="login-form">
        <form>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tên đăng nhập"
              required="required"
              value={username}
              onChange={this.handleChangeUsername}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              required="required"
              value={password}
              onChange={this.handleChangePassword}
            />
          </div>
          <div className="form-group">
            <button
              onClick={(e) =>
                this.props.submit(this.state.loginData,e)
              }
              className="button btn btn-block"
            >
              Đăng nhập
            </button>
          </div>
          <div className="clearfix"></div>
        </form>
        <p className="text-center">
          <a href="javascipt:void(0)" onClick={this.props.register}>
            Đăng ký tài khoản
          </a>
        </p>
      </div>
    );
  }
}

export default LoginPopup;
