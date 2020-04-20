import React, { Component } from "react";
import SkyLight from "react-skylight";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let loginPopupStyle = {
      backgroundColor: "black",
      width: "30%",
      marginLeft: "-35%",
      left: "70%",
    };
    let registerPopupStyle = {
      backgroundColor: "black",
      width: "70%",
      marginLeft: "-15%",
      left: "30%",
    };
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
        <div className="form-group">
          <div className="row">
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="tenTaiKhoan"
                placeholder="Họ và tên"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="ngaySinh"
                placeholder="Ngày sinh"
                required="required"
              />
            </div>
            <div className="col-4">
              <label class="form-check-label mr-5" for="radio1">
                Giới tính
              </label>
              <div class="form-check-inline">
                <label class="form-check-label" for="radio1">
                  <input
                    type="radio"
                    class="form-check-input"
                    id="radio1"
                    name="optradio"
                    value="option1"
                    checked
                  />
                  Nam
                </label>
              </div>
              <div class="form-check-inline">
                <label class="form-check-label" for="radio2">
                  <input
                    type="radio"
                    class="form-check-input"
                    id="radio2"
                    name="optradio"
                    value="option2"
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
                name="CMND"
                placeholder="CMND"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="ngayCap"
                placeholder="Ngày cấp"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                name="noiCap"
                placeholder="Nơi cấp"
                required="required"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="diaChi"
            placeholder="Địa chỉ"
            required="required"
          />
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="soDienThoai"
                placeholder="Số điện thoại"
                required="required"
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="Email"
                required="required"
              />
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
                placeholder="Tên đăng nhập"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="password"
                className="form-control"
                name="matKhau"
                placeholder="Mật khẩu"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="password"
                className="form-control"
                name="matKhau2"
                placeholder="Nhập lại mật khẩu"
                required="required"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="checkbox-inline" for="accept">
            <input
              type="checkbox"
              required="required"
              name="accept"
              id="accept"
            />{" "}
            Tôi đồng ý các điều khoản dịch vụ.
          </label>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-lg">
            Đăng ký
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
