import React, { Component } from "react";

class ChangePasswordPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
        password: {
          value: "",
          errors: [],
        },
        newPassword: {
          value: "",
          errors: [],
        },
        confirmNewPassword: {
          value: "",
          errors: [],
        },
    };
  }

  handleChangePassword = (event) => {
    this.state.password.value = event.target.value;
    this.setState({ ...this.state });
  };

  handleChangeNewPassword = (event) => {
    this.state.newPassword.value = event.target.value;
    this.setState({ ...this.state });
  };

  handleChangeConfirmNewPassword = (event) => {
    this.state.confirmNewPassword.value = event.target.value;
    this.setState({ ...this.state });
  };

  handleSubmit = (event) => {
    const {
      password,
      newPassword,
      confirmNewPassword
    } = this.state;
    Object.values(this.state).map((state) => {
      if (typeof state == "object") state.errors = [];
    });
    let data = {
      password: password.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value,
    };

    if (!password.value) {
      password.errors.push("Mật khẩu không được để trống");
    } else if (
      !password.value.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      )
    )
    password.errors.push("Mật khẩu không hợp lệ");
    if (!newPassword.value) {
      newPassword.errors.push("Mật khẩu không được để trống");
    } else if (
      !newPassword.value.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      )
    )
    newPassword.errors.push("Mật khẩu không hợp lệ");
    if (!newPassword.value || confirmNewPassword.value != newPassword.value) {
      confirmNewPassword.errors.push("Mật khẩu không khớp");
    }
    let count = 0;
    Object.values(this.state).forEach((state) => {
      if (typeof state == "object" && state.errors.length != 0) count++;
    });
    if (!count) this.props.callback(data);
    else {
      event.preventDefault();
      this.setState((state) => ({ ...state }));
    }
  }

  render() {
    let { password, newPassword, confirmNewPassword } = this.state;
    return (
      <div className="passwordChangePopup">
        <hr />
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu cũ"
            value={password.value}
            onChange={this.handleChangePassword}
          />
          {this.state.password.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu mới"
            value={newPassword.value}
            onChange={this.handleChangeNewPassword}
          />
          {this.state.newPassword.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="Nhập mật lại khẩu mới"
            value={confirmNewPassword.value}
            onChange={this.handleChangeConfirmNewPassword}
          />
          {this.state.confirmNewPassword.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
        </div>
        <hr />
        <button className="btn btn-block button" onClick={this.handleSubmit}>Đổi mật khẩu</button>
      </div>
    );
  }
}

export default ChangePasswordPopup;
