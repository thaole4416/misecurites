import React, { Component } from "react";

class ChangePasswordPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data : {
        password: "",
        newPassword: "",
        confirmNewPassword:""
      },
    };
  }

  handleChangePassword = (event) => {
    this.state.data.password = event.target.value;
    this.setState({ ...this.state });
  };

  handleChangeNewPassword = (event) => {
    this.state.data.newPassword = event.target.value;
    this.setState({ ...this.state });
  };

  handleChangeConfirmNewPassword = (event) => {
    this.state.data.confirmNewPassword = event.target.value;
    this.setState({ ...this.state });
  };


  render() {
    let { password,newPassword,confirmNewPassword } = this.state.data;
    return (
      <div className="passwordChangePopup" style={{padding: 15}}>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Nhập mật khẩu cũ"
          value={password}
          onChange={this.handleChangePassword}
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={this.handleChangeNewPassword}
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Nhập mật lại khẩu mới"
          value={confirmNewPassword}
          onChange={this.handleChangeConfirmNewPassword}
        />
      </div>
      <hr />
      <button className="btn btn-block button">Đổi mật khẩu</button>
    </div>
    );
  }
}

export default ChangePasswordPopup;
