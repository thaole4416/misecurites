import React, { Component } from "react";
import { ReactDatez, ReduxReactDatez } from "react-datez";

class RegisterPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tenTaiKhoan: {
        value: "",
        errors: [],
      },
      tenDangNhap: {
        value: "",
        errors: [],
      },
      tenDangNhap: {
        value: "",
        errors: [],
      },
      tenDangNhap: {
        value: "",
        errors: [],
      },
      tenDangNhap: {
        value: "",
        errors: [],
      },
      tenDangNhap: {
        value: "",
        errors: [],
      },
      tenDangNhap: {
        value: "",
        errors: [],
      },
      matKhau: {
        value: "",
        errors: [],
      },
      ngaySinh: {
        value: "",
        errors: [],
      },
      CMND: {
        value: "",
        errors: [],
      },
      ngayCap: {
        value: "",
        errors: [],
      },
      noiCap: {
        value: "",
        errors: [],
      },
      diaChi: {
        value: "",
        errors: [],
      },
      soDienThoai: {
        value: "",
        errors: [],
      },
      email: {
        value: "",
        errors: [],
      },
      createdTime: {
        value: "",
        errors: [],
      },
      matKhau2: {
        value: "",
        errors: [],
      },
      accept: {
        value: false,
        errors: [],
      },
      male: true,
      dateInput: "",
    };
  }

  handleChange = (event) => {
    this.state[event.target.name].value = event.target.value;
    this.state[event.target.name].errors = [];
    this.setState((state) => ({ ...state }));
  };

  handleChangeDOB = (value) => {
    this.state.ngaySinh.value = value;
    this.setState((state) => ({ ...state }));
  };

  handleChangeDate = (value) => {
    this.state.ngayCap.value = value;
    this.setState((state) => ({ ...state }));
  };

  handleAccept = () => {
    this.state.accept.value = !this.state.accept.value;
    this.state.accept.errors = [];
    this.setState((state) => ({ ...state }));
  };

  handleSubmit = (event) => {
    const {
      tenTaiKhoan,
      tenDangNhap,
      matKhau,
      matKhau2,
      ngaySinh,
      CMND,
      ngayCap,
      noiCap,
      diaChi,
      soDienThoai,
      email,
      male,
      accept,
    } = this.state;
    Object.values(this.state).map((state) => {
      if (typeof state == "object") state.errors = [];
    });
    let data = {
      tenTaiKhoan: tenTaiKhoan.value,
      tenDangNhap: tenDangNhap.value,
      matKhau: matKhau.value,
      ngaySinh: ngaySinh.value,
      CMND: CMND.value,
      ngayCap: ngayCap.value,
      noiCap: noiCap.value,
      diaChi: diaChi.value,
      soDienThoai: soDienThoai.value,
      email: email.value,
    };
    if (!tenTaiKhoan.value) {
      tenTaiKhoan.errors.push("Tên tài khoản không được để trống");
    }
    if (!tenDangNhap.value) {
      tenDangNhap.errors.push("Tên dăng nhập không được để trống");
    }
    if (!matKhau.value) {
      matKhau.errors.push("Mật khẩu không được để trống");
    } else if (
      !matKhau.value.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      )
    )
      matKhau.errors.push("Mật khẩu không hợp lệ");
    if (!matKhau2.value || matKhau.value != matKhau2.value) {
      matKhau2.errors.push("Mật khẩu không khớp");
    }
    if (!ngaySinh.value) {
      ngaySinh.errors.push("Ngày sinh không được để trống");
    }
    if (!CMND.value) {
      CMND.errors.push("CMND không được để trống");
    }
    if (!CMND.value.match(/^(\d{9}|\d{12})$/))
      CMND.errors.push("CMND không hợp lệ");
    if (!ngayCap.value) {
      ngayCap.errors.push("Ngày cấp không được để trống");
    }
    if (!noiCap.value) {
      noiCap.errors.push("Nơi cấp không được để trống");
    }
    if (!diaChi.value) {
      diaChi.errors.push("Địa chỉ không được để trống");
    }
    if (!soDienThoai.value) {
      soDienThoai.errors.push("Số điện thoại không được để trống");
    }
    if (!email.value) {
      email.errors.push("Email không được để trống");
    }
    if (!accept.value) {
      accept.errors.push("Đọc kỹ và đồng ý với điều khoản dịch vụ");
    }
    let count = 0;
    Object.values(this.state).forEach((state) => {
      if (typeof state == "object" && state.errors.length != 0) count++;
    });
    if (!count) this.props.submit(data, event);
    else {
      event.preventDefault();
      this.setState((state) => ({ ...state }));
    }
  };

  render() {
    return (
      <form>
        <hr />
        {this.props.errors.map((error) => (
          <div className="text-danger p-1">{error}</div>
        ))}
        <div className="form-group">
          <div className="row">
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="tenTaiKhoan"
                value={this.state.tenTaiKhoan.value}
                onChange={this.handleChange}
                placeholder="Họ và tên"
              />
              {this.state.tenTaiKhoan.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-4">
              {/* <input
                type="text"
                className="form-control"
                name="ngaySinh"
                value={this.state.ngaySinh.value}
                onChange={this.handleChange}
                placeholder="Ngày sinh"
                required="required"
              /> */}
              {/* <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChangeDate}
              /> */}
              <ReactDatez
                name="ngaySinh"
                handleChange={this.handleChangeDOB}
                value={this.state.ngaySinh.value}
                className="reactDatez"
                placeholder="Ngày sinh"
                allowPast={true}
              />
              {this.state.ngaySinh.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-4">
              <label className="form-check-label mr-5" htmlFor="radio1">
                Giới tính
              </label>
              <div className="form-check-inline">
                <label className="form-check-label" htmlFor="radio1">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="radio1"
                    name="optradio"
                    checked={this.state.male}
                    onClick={() => this.setState({ male: true })}
                  />
                  Nam
                </label>
              </div>
              <div className="form-check-inline">
                <label className="form-check-label" htmlFor="radio2">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="radio2"
                    name="optradio"
                    checked={!this.state.male}
                    onClick={() => this.setState({ male: false })}
                  />
                  Nữ
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="tenDangNhap"
                value={this.state.tenDangNhap.value}
                onChange={this.handleChange}
                placeholder="Tên đăng nhập"
              />
              {this.state.tenDangNhap.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-4">
              <input
                type="password"
                className="form-control"
                name="matKhau"
                value={this.state.matKhau.value}
                onChange={this.handleChange}
                placeholder="Mật khẩu"
              />
              {this.state.matKhau.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-4">
              <input
                type="password"
                className="form-control"
                name="matKhau2"
                value={this.state.matKhau2.value}
                onChange={this.handleChange}
                placeholder="Nhập lại mật khẩu"
              />
              {this.state.matKhau2.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="CMND"
                value={this.state.CMND.value}
                onChange={this.handleChange}
                placeholder="CMND"
              />
              {this.state.CMND.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-4">
              {/* <input
                type="text"
                className="form-control"
                name="ngayCap"
                value={this.state.ngayCap.value}
                onChange={this.handleChange}
                placeholder="Ngày cấp"
                required="required"
              /> */}
              <ReactDatez
                name="ngayCap"
                handleChange={this.handleChangeDate}
                value={this.state.ngayCap.value}
                className="reactDatez"
                placeholder="Ngày cấp"
                allowPast={true}
              />
              {this.state.ngayCap.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="noiCap"
                value={this.state.noiCap.value}
                onChange={this.handleChange}
                placeholder="Nơi cấp"
              />
              {this.state.noiCap.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="diaChi"
            value={this.state.diaChi.value}
            onChange={this.handleChange}
            placeholder="Địa chỉ"
          />
          {this.state.diaChi.errors.map((error) => (
            <div className="text-danger p-1">{error}</div>
          ))}
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-6">
              <input
                type="number"
                className="form-control"
                name="soDienThoai"
                value={this.state.soDienThoai.value}
                onChange={this.handleChange}
                placeholder="Số điện thoại"
              />
              {this.state.soDienThoai.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="email"
                value={this.state.email.value}
                onChange={this.handleChange}
                placeholder="Email"
              />
              {this.state.email.errors.map((error) => (
                <div className="text-danger p-1">{error}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-inline" htmlFor="accept">
            <input
              type="checkbox"
              name="accept"
              value={this.state.accept.value}
              onChange={this.handleAccept}
              id="accept"
            />
            &nbsp;Tôi đồng ý các điều khoản dịch vụ.
          </label>
          {this.state.accept.errors.map((error) => (
            <div className="text-danger p-1">{error}</div>
          ))}
        </div>

        <div className="form-group">
          <button className="btn button btn-lg" onClick={this.handleSubmit}>
            Đăng ký
          </button>
        </div>
      </form>
    );
  }
}

export default RegisterPopup;
