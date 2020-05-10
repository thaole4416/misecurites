import React, { Component } from 'react'
import SkyLight from "react-skylight";


class RegisterPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {


        return (
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
                        value="option1"
                        checked
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
              <label className="checkbox-inline" htmlFor="accept">
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
        )
    }
}

export default RegisterPopup
