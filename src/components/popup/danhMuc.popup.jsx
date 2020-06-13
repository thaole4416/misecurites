import React, { Component } from "react";
import SkyLight from "react-skylight";

class DanhMuc extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="danhMuc popup">
        <hr />
        {!this.props.info && (
          <table className="table-top">
            <thead style={{ fontWeight: "100" }}>
              <tr>
                <th className={`th `} style={{ width: "3%" }}>
                  Mã CP
                </th>
                <th className={`th `} style={{ width: "3%" }}>
                  Khối lượng
                </th>
                <th className={`th `} style={{ width: "3%" }}>
                  Bán
                </th>
                <th className={`th `} style={{ width: "3%" }}>
                  Chờ về
                </th>
                <th className={`th `} style={{ width: "3%" }}></th>
              </tr>
            </thead>
            <tbody className="table-row">
              {this.props.danhMuc.map((danhMuc) => (
                <tr className="highlight">
                  <td className={`td`}>
                    <span>{danhMuc.maCoPhieu}</span>
                  </td>
                  <td className={`td`}>
                    <span>{danhMuc.khoiLuong}</span>
                  </td>
                  <td className={`td`}>
                    <span>{danhMuc.ban}</span>
                  </td>
                  <td className={`td`}>
                    <span>{danhMuc.choVe}</span>
                  </td>
                  <td className={`td`} style={{ textAlign: "center" }}>
                    <span className="text-success p-2" onClick={() => this.props.checkSymbol(danhMuc.maCoPhieu,false)}>Mua</span>&nbsp;
                    <span className="text-danger p-2" onClick={() => this.props.checkSymbol(danhMuc.maCoPhieu,true)}>Bán</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default DanhMuc;
