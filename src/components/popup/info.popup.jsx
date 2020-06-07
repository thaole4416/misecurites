import React, { Component } from "react";
import SkyLight from "react-skylight";

class InfoPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="infoPopup" >
                <hr />
        {this.props.info && (
          <table className="table--left" style={{ border: "none" }}>
            <tbody>
              <tr>
                <td>Tên tài khoản</td>
                <td>{this.props.info.tenTaiKhoan}</td>
              </tr>
              <tr>
                <td>Số tài khoản</td>
                <td>{this.props.info._id}</td>
              </tr>
              <tr>
                <td>CMND</td>
                <td>{this.props.info.CMND}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.props.info.email}</td>
              </tr>
              <tr>
                <td>Ngày cấp</td>
                <td>{this.props.info.ngayCap}</td>
              </tr>
              <tr>
                <td>Ngày sinh</td>
                <td>{this.props.info.ngaySinh}</td>
              </tr>
              <tr>
                <td>Nơi cấp</td>
                <td>{this.props.info.noiCap}</td>
              </tr>
              <tr>
                <td>Số điện thoại</td>
                <td>{this.props.info.soDienThoai}</td>
              </tr>
              <tr>
                <td>Số dư</td>
                <td>{this.props.info.soDu}</td>
              </tr>
            </tbody>
          </table>
        )}

        {/* <table className="table-top" style={{ background: "black" }}>
            <thead style={{ color: "white", fontWeight: "100" }}>
              <tr>
                <th className={`th `} style={{ width: "3%" }}>
                  Mã CP
                </th>
                <th className={`th `} style={{ width: "4.5%" }}>
                  Giá
                </th>
                <th className={`th `} style={{ width: "3%" }}>
                  KL
                </th>
                <th className={`th `} style={{ width: "4.5%" }}>
                  Thời gian
                </th>
                <th className={`th `} style={{ width: "3%" }}>
                  Tình trạng
                </th>
                <th className={`th `} style={{ width: "3%" }}></th>
              </tr>
            </thead>
            <tbody className="table-row">
              <tr className="highlight">
                <td className={`td`}>
                  <span>1</span>
                </td>
                <td className={`td`}>
                  <span>1</span>
                </td>
                <td className={`td`}>
                  <span>1</span>
                </td>
                <td className={`td`}>
                  <span>1</span>
                </td>
                <td className={`td`}>
                  <span>1</span>
                </td>
                <td className={`td`}>
                  <a className="fa fa-pencil-alt"></a>
                  <a className="fa fa-times"></a>
                </td>
              </tr>
            </tbody>
          </table> */}
      </div>
    );
  }
}

export default InfoPopup;
