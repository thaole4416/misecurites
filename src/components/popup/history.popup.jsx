import React, { Component } from "react";

class HistoryPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  edit = (symbol, isBuy, gia, khoiLuong, event) => {
    if (window.confirm("Bạn có muốn sửa lệnh")) {
      this.props.checkEdit(symbol,isBuy,gia,khoiLuong)
    } else {
      event.preventDefault();
    }
  };

  cancel = (maLenh, event) => {
    if (window.confirm("Bạn có muốn hủy lệnh")) {
      this.props.cancel(maLenh);
    } else {
      event.preventDefault();
    }
  };

  render() {
    return (
      <div className="historyPopup popup">
        <hr />
        <table className="table-top">
          <thead style={{ fontWeight: "100" }}>
            <tr>
              <th className={`th `} style={{ width: "3%" }}>
                Mã CP
              </th>
              <th className={`th `} style={{ width: "3%" }}>
                Lệnh
              </th>
              <th className={`th `} style={{ width: "4.5%" }}>
                Giá
              </th>
              <th className={`th `} style={{ width: "3%" }}>
                KL
              </th>
              <th className={`th `} style={{ width: "3%" }}>
                Tình trạng
              </th>
              <th className={`th `} style={{ width: "3%" }}></th>
            </tr>
          </thead>
          <tbody className="table-row content-center">
            {this.props.history.map((history) => (
              <tr className="highlight">
                <td className={`td`}>
                  <span>{history.maCoPhieu}</span>
                </td>
                <td className={`td`}>
                  <span>{history.loaiLenh.split(" ")[0]}</span>
                </td>
                <td className={`td`}>
                  <span>{history.gia}</span>
                </td>
                <td className={`td`}>
                  <span>
                    {history.khoiLuong * 1 - history.khoiLuongConLai * 1}/
                    {history.khoiLuong}
                  </span>
                </td>

                <td className={`td`}>
                  <span>{history.trangThai}</span>
                </td>
                <td className={`td`}>
                  <a
                    className="fa fa-pencil-alt"
                    onClick={(e) =>
                      this.edit(
                        history.maCoPhieu,
                        history.loaiLenh.split(" ")[0] == "mua" ? false : true,
                        history.gia,
                        history.khoiLuongConLai,
                        history._id,
                        history.loaiLenh,
                        e
                      )
                    }
                  ></a>
                  <a
                    className="fa fa-times"
                    onClick={(e) => this.cancel(history._id, e)}
                  ></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default HistoryPopup;
